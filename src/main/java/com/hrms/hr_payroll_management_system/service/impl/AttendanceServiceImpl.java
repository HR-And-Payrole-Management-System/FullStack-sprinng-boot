package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.attendance.AdjustAttendanceRequest;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceMonthlySummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceResponse;
import com.hrms.hr_payroll_management_system.entity.Attendance;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.EmployeeWorkSchedule;
import com.hrms.hr_payroll_management_system.entity.WorkSchedule;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.AttendanceRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeWorkScheduleRepository;
import com.hrms.hr_payroll_management_system.repository.HolidayRepository;
import com.hrms.hr_payroll_management_system.repository.specification.AttendanceSpecification;
import com.hrms.hr_payroll_management_system.service.AttendanceCalculationService;
import com.hrms.hr_payroll_management_system.service.AttendanceService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeWorkScheduleRepository employeeWorkScheduleRepository;
    private final AttendanceCalculationService attendanceCalculationService;
        private final HolidayRepository holidayRepository;
    @Override
    public AttendanceResponse checkIn(Long employeeId) {

        Employee employee = getEmployee(employeeId);

        LocalDate today = LocalDate.now();

        if (attendanceRepository.existsByEmployeeIdAndWorkDate(
                employeeId,
                today
        )) {
            throw new BadRequestException(
                    "Employee has already checked in today."
            );
        }

        EmployeeWorkSchedule assignment =
                employeeWorkScheduleRepository
                        .findActiveSchedule(
                                employeeId,
                                today
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No active work schedule found for employee."
                                )
                        );

        WorkSchedule schedule =
                assignment.getWorkSchedule();

        Attendance attendance =
                Attendance.builder()
                        .employee(employee)
                        .workSchedule(schedule)
                        .workDate(today)
                        .checkInTime(LocalDateTime.now())
                        .status(AttendanceStatus.PRESENT)
                        .build();

        Attendance saved =
                attendanceRepository.save(attendance);

        return mapResponse(saved);
    }

    @Override
    public AttendanceResponse checkOut(Long employeeId) {

        LocalDate today = LocalDate.now();

        Attendance attendance =
                attendanceRepository
                        .findByEmployeeIdAndWorkDate(
                                employeeId,
                                today
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance record not found for today."
                                )
                        );

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException(
                    "Employee has already checked out today."
            );
        }

        attendance.setCheckOutTime(
                LocalDateTime.now()
        );
        
        

        attendanceCalculationService.calculate(
                attendance
        );

        Attendance saved =
                attendanceRepository.save(attendance);

            
        return mapResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getById(Long id) {

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance not found."
                                )
                        );

        return mapResponse(attendance);
    }

    private Employee getEmployee(Long id) {

        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found."
                        )
                );
    }

    private AttendanceResponse mapResponse(
            Attendance attendance
    ) {

        Employee employee = attendance.getEmployee();

        WorkSchedule schedule =
                attendance.getWorkSchedule();

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employeeId(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )
                .workScheduleId(
                        schedule == null
                                ? null
                                : schedule.getId()
                )
                .workScheduleName(
                        schedule == null
                                ? null
                                : schedule.getName()
                )
                .workDate(attendance.getWorkDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .status(attendance.getStatus().name())
                .workedMinutes(attendance.getWorkedMinutes())
                .lateMinutes(attendance.getLateMinutes())
                .earlyLeaveMinutes(
                        attendance.getEarlyLeaveMinutes()
                )
                .overtimeMinutes(
                        attendance.getOvertimeMinutes()
                )
                .note(attendance.getNote())
                .build();
    }
    @Override
    public AttendanceResponse adjust(
            Long attendanceId,
            AdjustAttendanceRequest request
    ) {

        Attendance attendance =
                attendanceRepository
                        .findById(attendanceId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attendance not found."
                                )
                        );

        if (request.getCheckInTime() != null) {
            attendance.setCheckInTime(
                    request.getCheckInTime()
            );
        }

        if (request.getCheckOutTime() != null) {
            attendance.setCheckOutTime(
                    request.getCheckOutTime()
            );
        }

        if (attendance.getCheckInTime() != null
                && attendance.getCheckOutTime() != null
                && attendance.getCheckOutTime()
                .isBefore(attendance.getCheckInTime())) {

            throw new BadRequestException(
                    "Check-out time cannot be before check-in time."
            );
        }

        attendance.setAdjusted(true);
        attendance.setAdjustmentReason(
                request.getReason()
        );

        attendanceCalculationService.calculate(
                attendance
        );

        return mapResponse(
                attendanceRepository.save(attendance)
        );
    }
    @Override
    @Transactional(readOnly = true)
    public PageResponse<AttendanceResponse> search(
            int page,
            int size,
            Long employeeId,
            Long departmentId,
            Long branchId,
            AttendanceStatus status,
            LocalDate startDate,
            LocalDate endDate
    ) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("workDate").descending()
                );

        Specification<Attendance> spec =
                Specification
                        .where(
                                AttendanceSpecification
                                        .employee(employeeId)
                        )
                        .and(
                                AttendanceSpecification
                                        .department(departmentId)
                        )
                        .and(
                                AttendanceSpecification
                                        .branch(branchId)
                        )
                        .and(
                                AttendanceSpecification
                                        .status(status)
                        )
                        .and(
                                AttendanceSpecification
                                        .dateRange(
                                                startDate,
                                                endDate
                                        )
                        );

        Page<Attendance> result =
                attendanceRepository.findAll(
                        spec,
                        pageable
                );

        return PageResponse.<AttendanceResponse>builder()
                .content(
                        result.getContent()
                                .stream()
                                .map(this::mapResponse)
                                .toList()
                )
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public AttendanceMonthlySummaryResponse getMonthlySummary(
            Long employeeId,
            int year,
            int month
    ) {

        Employee employee =
                getEmployee(employeeId);

        LocalDate start =
                LocalDate.of(year, month, 1);

        LocalDate end =
                start.withDayOfMonth(
                        start.lengthOfMonth()
                );

        Pageable pageable =
                Pageable.unpaged();

        Page<Attendance> page =
                attendanceRepository
                        .findByEmployeeIdAndWorkDateBetween(
                                employeeId,
                                start,
                                end,
                                pageable
                        );

        var records = page.getContent();

        return AttendanceMonthlySummaryResponse.builder()
                .employeeId(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .year(year)
                .month(month)
                .totalRecords((long) records.size())
                .presentDays(
                        records.stream()
                                .filter(a ->
                                        a.getStatus()
                                                == AttendanceStatus.PRESENT
                                )
                                .count()
                )
                .lateDays(
                        records.stream()
                                .filter(a ->
                                        a.getStatus()
                                                == AttendanceStatus.LATE
                                )
                                .count()
                )
                .halfDays(
                        records.stream()
                                .filter(a ->
                                        a.getStatus()
                                                == AttendanceStatus.HALF_DAY
                                )
                                .count()
                )
                .absentDays(
                        records.stream()
                                .filter(a ->
                                        a.getStatus()
                                                == AttendanceStatus.ABSENT
                                )
                                .count()
                )
                .totalWorkedMinutes(
                        records.stream()
                                .mapToLong(a ->
                                        a.getWorkedMinutes() == null
                                                ? 0
                                                : a.getWorkedMinutes()
                                )
                                .sum()
                )
                .totalOvertimeMinutes(
                        records.stream()
                                .mapToLong(a ->
                                        a.getOvertimeMinutes() == null
                                                ? 0
                                                : a.getOvertimeMinutes()
                                )
                                .sum()
                )
                .build();
    }
    private void markAbsentEmployees(LocalDate workDate) {

        boolean holiday =
                holidayRepository
                        .existsByHolidayDateAndActiveTrue(
                                workDate
                        );

        if (holiday) {
                return;
        }

        // TODO:
        // Find employees who are expected to work on this date.
        // Check whether they already have attendance.
        // If they do not have attendance, create ABSENT record.
        }
    
}
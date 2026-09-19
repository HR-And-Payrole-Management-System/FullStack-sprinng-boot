package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.attendance.AdjustAttendanceRequest;
import com.hrms.hr_payroll_management_system.dto.request.notification.CreateNotificationRequest;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceMonthlySummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceResponse;
import com.hrms.hr_payroll_management_system.entity.Attendance;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.EmployeeWorkSchedule;
import com.hrms.hr_payroll_management_system.entity.WorkSchedule;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;
import com.hrms.hr_payroll_management_system.enums.NotificationType;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.AttendanceRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeWorkScheduleRepository;
import com.hrms.hr_payroll_management_system.repository.HolidayRepository;
import com.hrms.hr_payroll_management_system.repository.specification.AttendanceSpecification;
import com.hrms.hr_payroll_management_system.service.AttendanceCalculationService;
import com.hrms.hr_payroll_management_system.service.AttendanceQrService;
import com.hrms.hr_payroll_management_system.service.AttendanceService;
import com.hrms.hr_payroll_management_system.service.notification.NotificationService;
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
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeWorkScheduleRepository employeeWorkScheduleRepository;
    private final AttendanceCalculationService attendanceCalculationService;
    private final HolidayRepository holidayRepository;
    private final AttendanceQrService attendanceQrService;
    private final NotificationService notificationService;

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

    @Override
    public AttendanceResponse checkInSelf(String email) {

        Employee employee = getEmployeeByEmail(email);

        return checkIn(employee.getId());
    }

    @Override
    public AttendanceResponse checkOutSelf(String email) {

        Employee employee = getEmployeeByEmail(email);

        return checkOut(employee.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getTodayForSelf(String email) {

        Employee employee = getEmployeeByEmail(email);

        return attendanceRepository
                .findByEmployeeIdAndWorkDate(
                        employee.getId(),
                        LocalDate.now()
                )
                .map(this::mapResponse)
                .orElse(null);
    }

    private Employee getEmployeeByEmail(String email) {

        return employeeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No employee record is linked to your account."
                        )
                );
    }

    @Override
    public AttendanceResponse scanQr(String email, String token) {

        Employee employee = getEmployeeByEmail(email);

        Long branchId = attendanceQrService.validateToken(token);

        if (employee.getBranch() != null
                && !employee.getBranch().getId().equals(branchId)) {
            throw new BadRequestException(
                    "This QR code belongs to a different branch."
            );
        }

        Optional<Attendance> today =
                attendanceRepository.findByEmployeeIdAndWorkDate(
                        employee.getId(),
                        LocalDate.now()
                );

        if (today.isEmpty()) {
            AttendanceResponse response = checkIn(employee.getId());
            notifyAttendanceManagers(
                    employee,
                    NotificationType.ATTENDANCE_CHECKED_IN,
                    employee.getFirstName() + " " + employee.getLastName()
                            + " checked in via QR at "
                            + response.getCheckInTime()
            );
            return response;
        }

        if (today.get().getCheckOutTime() == null) {
            AttendanceResponse response = checkOut(employee.getId());
            notifyAttendanceManagers(
                    employee,
                    NotificationType.ATTENDANCE_CHECKED_OUT,
                    employee.getFirstName() + " " + employee.getLastName()
                            + " checked out via QR at "
                            + response.getCheckOutTime()
            );
            return response;
        }

        throw new BadRequestException(
                "You have already completed attendance for today."
        );
    }

    // Alerts everyone who can manage attendance (i.e. holds the
    // ATTENDANCE_ADJUST permission — the same permission that
    // guards the kiosk screen) that a QR check-in/out happened.
    // The scanning employee is excluded so HR staff don't get
    // notified about their own scan.
    private void notifyAttendanceManagers(
            Employee scannedEmployee,
            NotificationType type,
            String message
    ) {
        List<Employee> managers =
                employeeRepository.findByPermissionName("ATTENDANCE_ADJUST");

        for (Employee manager : managers) {

            if (manager.getId().equals(scannedEmployee.getId())) {
                continue;
            }

            CreateNotificationRequest notifRequest = new CreateNotificationRequest();
            notifRequest.setEmployeeId(manager.getId());
            notifRequest.setType(type);
            notifRequest.setTitle("Attendance check-in/out");
            notifRequest.setMessage(message);
            notifRequest.setReferenceType("ATTENDANCE");
            notifRequest.setReferenceId(scannedEmployee.getId());

            notificationService.create(notifRequest);
        }
    }
}
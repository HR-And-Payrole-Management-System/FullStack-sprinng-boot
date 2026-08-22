package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.leave.CreateLeaveRequest;
import com.hrms.hr_payroll_management_system.dto.request.leave.ReviewLeaveRequest;
import com.hrms.hr_payroll_management_system.dto.response.leave.LeaveRequestResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.LeaveBalance;
import com.hrms.hr_payroll_management_system.entity.LeaveRequest;
import com.hrms.hr_payroll_management_system.entity.LeaveType;
import com.hrms.hr_payroll_management_system.enums.LeaveRequestStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.HolidayRepository;
import com.hrms.hr_payroll_management_system.repository.LeaveBalanceRepository;
import com.hrms.hr_payroll_management_system.repository.LeaveRequestRepository;
import com.hrms.hr_payroll_management_system.repository.LeaveTypeRepository;
import com.hrms.hr_payroll_management_system.service.LeaveService;
import com.hrms.hr_payroll_management_system.service.audit.AuditLogService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hrms.hr_payroll_management_system.repository.HolidayRepository;
import com.hrms.hr_payroll_management_system.enums.AuditAction;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final EmployeeRepository employeeRepository;
        private final HolidayRepository holidayRepository;
        private final AuditLogService auditLogService;
    @Override
    public LeaveRequestResponse requestLeave(
            Long employeeId,
            CreateLeaveRequest request
    ) {

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found."
                                )
                        );

        LeaveType leaveType =
                leaveTypeRepository
                        .findById(request.getLeaveTypeId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave type not found."
                                )
                        );

        boolean overlapping =
                leaveRequestRepository
                        .existsByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                                employeeId,
                                LeaveRequestStatus.APPROVED,
                                request.getEndDate(),
                                request.getStartDate()
                        );

        if (overlapping) {
            throw new BadRequestException(
                    "Employee already has approved leave in this date range."
            );
        }

        double totalDays =
                calculateWorkingDays(
                        request.getStartDate(),
                        request.getEndDate()
                );

        if (totalDays <= 0) {
            throw new BadRequestException(
                    "Leave request contains no working days."
            );
        }

        LeaveBalance balance =
                getOrCreateBalance(
                        employee,
                        leaveType,
                        request.getStartDate().getYear()
                );

        if (balance.getRemainingDays() < totalDays) {
            throw new BadRequestException(
                    "Insufficient leave balance."
            );
        }

        LeaveRequest leaveRequest =
                LeaveRequest.builder()
                        .employee(employee)
                        .leaveType(leaveType)
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .totalDays(totalDays)
                        .reason(request.getReason())
                        .status(LeaveRequestStatus.PENDING)
                        .build();

        return mapResponse(
                leaveRequestRepository.save(leaveRequest)
        );
    }

    @Override
    public LeaveRequestResponse approve(
            Long id,
            ReviewLeaveRequest request
    ) {

        LeaveRequest leaveRequest =
                getLeaveRequest(id);

        if (leaveRequest.getStatus()
                != LeaveRequestStatus.PENDING) {

            throw new BadRequestException(
                    "Only pending leave requests can be approved."
            );
        }

        int year =
                leaveRequest.getStartDate().getYear();

        LeaveBalance balance =
                getOrCreateBalance(
                        leaveRequest.getEmployee(),
                        leaveRequest.getLeaveType(),
                        year
                );

        if (balance.getRemainingDays()
                < leaveRequest.getTotalDays()) {

            throw new BadRequestException(
                    "Insufficient leave balance."
            );
        }

        balance.setUsedDays(
                balance.getUsedDays()
                        + leaveRequest.getTotalDays()
        );

        balance.setRemainingDays(
                balance.getAllocatedDays()
                        - balance.getUsedDays()
        );

        leaveBalanceRepository.save(balance);

        leaveRequest.setStatus(
        LeaveRequestStatus.APPROVED
        );

        leaveRequest.setReviewComment(
                request.getComment()
        );

        leaveRequest.setReviewedAt(
                LocalDateTime.now()
        );

        LeaveRequest saved =
                leaveRequestRepository.save(
                        leaveRequest
                );

        auditLogService.log(
                AuditAction.APPROVE,
                "LEAVE_REQUEST",
                saved.getId(),
                "Leave request approved."
        );

        return mapResponse(saved);
    }

    @Override
    public LeaveRequestResponse reject(
            Long id,
            ReviewLeaveRequest request
    ) {

        LeaveRequest leaveRequest =
                getLeaveRequest(id);

        if (leaveRequest.getStatus()
                != LeaveRequestStatus.PENDING) {

            throw new BadRequestException(
                    "Only pending leave requests can be rejected."
            );
        }

       leaveRequest.setStatus(
        LeaveRequestStatus.REJECTED
        );

        leaveRequest.setReviewComment(
                request.getComment()
        );

        leaveRequest.setReviewedAt(
                LocalDateTime.now()
        );

        LeaveRequest saved =
                leaveRequestRepository.save(
                        leaveRequest
                );

        auditLogService.log(
                AuditAction.REJECT,
                "LEAVE_REQUEST",
                saved.getId(),
                "Leave request rejected."
        );

        return mapResponse(saved);
    }

    @Override
    public LeaveRequestResponse cancel(Long id) {

        LeaveRequest leaveRequest =
                getLeaveRequest(id);

        if (leaveRequest.getStatus()
                == LeaveRequestStatus.CANCELLED) {

            throw new BadRequestException(
                    "Leave request is already cancelled."
            );
        }

        if (leaveRequest.getStatus()
                == LeaveRequestStatus.REJECTED) {

            throw new BadRequestException(
                    "Rejected leave request cannot be cancelled."
            );
        }

        if (leaveRequest.getStatus()
                == LeaveRequestStatus.APPROVED) {

            LeaveBalance balance =
                    getOrCreateBalance(
                            leaveRequest.getEmployee(),
                            leaveRequest.getLeaveType(),
                            leaveRequest
                                    .getStartDate()
                                    .getYear()
                    );

            balance.setUsedDays(
                    Math.max(
                            0,
                            balance.getUsedDays()
                                    - leaveRequest.getTotalDays()
                    )
            );

            balance.setRemainingDays(
                    balance.getAllocatedDays()
                            - balance.getUsedDays()
            );

            leaveBalanceRepository.save(balance);
        }

        leaveRequest.setStatus(
                LeaveRequestStatus.CANCELLED
        );

        return mapResponse(
                leaveRequestRepository.save(leaveRequest)
        );
    }

    private LeaveBalance getOrCreateBalance(
            Employee employee,
            LeaveType leaveType,
            int year
    ) {

        return leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(
                        employee.getId(),
                        leaveType.getId(),
                        year
                )
                .orElseGet(() -> {

                    double allocated =
                            leaveType.getDefaultDays();

                    LeaveBalance balance =
                            LeaveBalance.builder()
                                    .employee(employee)
                                    .leaveType(leaveType)
                                    .year(year)
                                    .allocatedDays(allocated)
                                    .usedDays(0.0)
                                    .remainingDays(allocated)
                                    .build();

                    return leaveBalanceRepository.save(
                            balance
                    );
                });
    }

    private double calculateWorkingDays(
        LocalDate start,
        LocalDate end
        ) {

        double days = 0;

        LocalDate current = start;

        while (!current.isAfter(end)) {

                DayOfWeek day =
                        current.getDayOfWeek();

                boolean weekend =
                        day == DayOfWeek.SATURDAY
                                || day == DayOfWeek.SUNDAY;

                boolean holiday =
                        holidayRepository
                                .existsByHolidayDateAndActiveTrue(
                                        current
                                );

                if (!weekend && !holiday) {
                days++;
                }

                current = current.plusDays(1);
        }

        return days;
        }

    private LeaveRequest getLeaveRequest(Long id) {

        return leaveRequestRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Leave request not found."
                        )
                );
    }

    private LeaveRequestResponse mapResponse(
            LeaveRequest leave
    ) {

        Employee employee = leave.getEmployee();

        return LeaveRequestResponse.builder()
                .id(leave.getId())
                .employeeId(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )
                .leaveTypeId(
                        leave.getLeaveType().getId()
                )
                .leaveTypeName(
                        leave.getLeaveType().getName()
                )
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .totalDays(leave.getTotalDays())
                .reason(leave.getReason())
                .status(leave.getStatus().name())
                .reviewComment(
                        leave.getReviewComment()
                )
                .build();
    }
}
package com.hrms.hr_payroll_management_system.service.report.impl;

import com.hrms.hr_payroll_management_system.dto.response.report.AttendanceReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.EmployeeReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.LeaveReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.PayrollReportResponse;
import com.hrms.hr_payroll_management_system.entity.Attendance;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.LeaveRequest;
import com.hrms.hr_payroll_management_system.entity.payroll.Payroll;
import com.hrms.hr_payroll_management_system.repository.AttendanceRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.LeaveRequestRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.PayrollRepository;
import com.hrms.hr_payroll_management_system.service.report.ReportService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;

    // =========================================================
    // Employee Report
    // =========================================================
    @Override
    public List<EmployeeReportResponse> getEmployeeReport(Long departmentId) {

        List<Employee> employees = (departmentId != null)
                ? employeeRepository.findByDepartmentId(departmentId)
                : employeeRepository.findAll();

        return employees.stream()
                .map(this::toEmployeeReportResponse)
                .collect(Collectors.toList());
    }

    private EmployeeReportResponse toEmployeeReportResponse(Employee e) {
        return EmployeeReportResponse.builder()
                .id(e.getId())
                .employeeCode(e.getEmployeeCode())
                .fullName(e.getFirstName() + " " + e.getLastName())
                .email(e.getEmail())
                .companyName(
                        e.getCompany() != null
                                ? e.getCompany().getName()
                                : null
                )
                .branchName(
                        e.getBranch() != null
                                ? e.getBranch().getName()
                                : null
                )
                .departmentName(
                        e.getDepartment() != null
                                ? e.getDepartment().getName()
                                : null
                )
                .positionName(
                        e.getPosition() != null
                                ? e.getPosition().getName()
                                : null
                )
                .status(e.getStatus())
                .hireDate(e.getHireDate())
                .build();
    }

    // =========================================================
    // Attendance Report
    // =========================================================
    @Override
    public List<AttendanceReportResponse> getAttendanceReport(
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<Attendance> attendances =
                attendanceRepository.findByWorkDateBetween(
                        startDate,
                        endDate
                );

        return attendances.stream()
                .map(this::toAttendanceReportResponse)
                .collect(Collectors.toList());
    }

    private AttendanceReportResponse toAttendanceReportResponse(
            Attendance a
    ) {
        Employee employee = a.getEmployee();

        return AttendanceReportResponse.builder()
                .employeeId(employee != null ? employee.getId() : null)
                .employeeCode(
                        employee != null ? employee.getEmployeeCode() : null
                )
                .employeeName(
                        employee != null
                                ? employee.getFirstName() + " "
                                        + employee.getLastName()
                                : null
                )
                .workDate(a.getWorkDate())
                .status(a.getStatus())
                .checkInTime(a.getCheckInTime())
                .checkOutTime(a.getCheckOutTime())
                .workedMinutes(a.getWorkedMinutes())
                .lateMinutes(a.getLateMinutes())
                .overtimeMinutes(a.getOvertimeMinutes())
                .build();
    }

    // =========================================================
    // Leave Report
    // =========================================================
    @Override
    public List<LeaveReportResponse> getLeaveReport(Integer year) {

        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        List<LeaveRequest> leaveRequests =
                leaveRequestRepository.findByStartDateBetween(
                        startOfYear,
                        endOfYear
                );

        return leaveRequests.stream()
                .map(this::toLeaveReportResponse)
                .collect(Collectors.toList());
    }

    private LeaveReportResponse toLeaveReportResponse(LeaveRequest lr) {
        Employee employee = lr.getEmployee();

        return LeaveReportResponse.builder()
                .employeeId(employee != null ? employee.getId() : null)
                .employeeCode(
                        employee != null ? employee.getEmployeeCode() : null
                )
                .employeeName(
                        employee != null
                                ? employee.getFirstName() + " "
                                        + employee.getLastName()
                                : null
                )
                .leaveTypeName(
                        lr.getLeaveType() != null
                                ? lr.getLeaveType().getName()
                                : null
                )
                .startDate(lr.getStartDate())
                .endDate(lr.getEndDate())
                .totalDays(lr.getTotalDays())
                .status(lr.getStatus())
                .build();
    }

    // =========================================================
    // Payroll Report
    // =========================================================
    @Override
    public List<PayrollReportResponse> getPayrollReport(
            Integer year,
            Integer month
    ) {
        List<Payroll> payrolls =
                payrollRepository.findByYearAndMonth(year, month);

        return payrolls.stream()
                .map(this::toPayrollReportResponse)
                .collect(Collectors.toList());
    }

    private PayrollReportResponse toPayrollReportResponse(Payroll p) {
        Employee employee = p.getEmployee();

        return PayrollReportResponse.builder()
                .employeeId(employee != null ? employee.getId() : null)
                .employeeCode(
                        employee != null ? employee.getEmployeeCode() : null
                )
                .employeeName(
                        employee != null
                                ? employee.getFirstName() + " "
                                        + employee.getLastName()
                                : null
                )
                .year(p.getYear())
                .month(p.getMonth())
                .basicSalary(p.getBasicSalary())
                .totalAllowance(p.getTotalAllowance())
                .overtimePay(p.getOvertimePay())
                .taxAmount(p.getTaxAmount())
                .totalDeduction(p.getTotalDeduction())
                .grossSalary(p.getGrossSalary())
                .netSalary(p.getNetSalary())
                .status(p.getStatus())
                .build();
    }
}
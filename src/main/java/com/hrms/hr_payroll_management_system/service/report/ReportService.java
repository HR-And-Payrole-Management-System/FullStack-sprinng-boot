package com.hrms.hr_payroll_management_system.service.report;

import com.hrms.hr_payroll_management_system.dto.response.report.AttendanceReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.EmployeeReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.LeaveReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.PayrollReportResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    List<EmployeeReportResponse> getEmployeeReport(Long departmentId);

    List<AttendanceReportResponse> getAttendanceReport(
            LocalDate startDate,
            LocalDate endDate
    );

    List<LeaveReportResponse> getLeaveReport(Integer year);

    List<PayrollReportResponse> getPayrollReport(
            Integer year,
            Integer month
    );
}
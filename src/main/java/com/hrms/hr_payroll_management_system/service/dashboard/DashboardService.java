package com.hrms.hr_payroll_management_system.service.dashboard;

import com.hrms.hr_payroll_management_system.dto.response.dashboard.AttendanceDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.DashboardSummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.EmployeeDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.LeaveDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.OrganizationDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.PayrollDashboardResponse;

import java.time.LocalDate;

public interface DashboardService {

    // Step 15-1
    DashboardSummaryResponse getSummary();

    // Step 15-2
    EmployeeDashboardResponse getEmployeeStats();

    // Step 15-3
    AttendanceDashboardResponse getAttendanceStats(LocalDate date);

    // Step 15-4
    LeaveDashboardResponse getLeaveStats(Integer year);

    // Step 15-5
    PayrollDashboardResponse getPayrollStats(Integer year, Integer month);

    // Step 15-6
    OrganizationDashboardResponse getOrganizationStats();
}
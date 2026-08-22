package com.hrms.hr_payroll_management_system.controller.dashboard;

import com.hrms.hr_payroll_management_system.dto.response.dashboard.AttendanceDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.DashboardSummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.EmployeeDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.LeaveDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.OrganizationDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.PayrollDashboardResponse;
import com.hrms.hr_payroll_management_system.service.dashboard.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard statistics APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get overall dashboard summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/employees")
    @Operation(summary = "Get employee statistics")
    public ResponseEntity<EmployeeDashboardResponse> getEmployeeStats() {
        return ResponseEntity.ok(dashboardService.getEmployeeStats());
    }

    @GetMapping("/attendance")
    @Operation(summary = "Get attendance statistics for a specific date")
    public ResponseEntity<AttendanceDashboardResponse> getAttendanceStats(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return ResponseEntity.ok(dashboardService.getAttendanceStats(date));
    }

    @GetMapping("/leaves")
    @Operation(summary = "Get leave statistics for a specific year")
    public ResponseEntity<LeaveDashboardResponse> getLeaveStats(
            @RequestParam Integer year
    ) {
        return ResponseEntity.ok(dashboardService.getLeaveStats(year));
    }

    @GetMapping("/payroll")
    @Operation(summary = "Get payroll statistics for a specific year/month")
    public ResponseEntity<PayrollDashboardResponse> getPayrollStats(
            @RequestParam Integer year,
            @RequestParam Integer month
    ) {
        return ResponseEntity.ok(
                dashboardService.getPayrollStats(year, month)
        );
    }

    @GetMapping("/organization")
    @Operation(summary = "Get organization statistics")
    public ResponseEntity<OrganizationDashboardResponse> getOrganizationStats() {
        return ResponseEntity.ok(dashboardService.getOrganizationStats());
    }
}
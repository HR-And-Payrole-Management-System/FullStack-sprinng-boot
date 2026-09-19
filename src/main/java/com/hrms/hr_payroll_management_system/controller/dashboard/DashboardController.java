package com.hrms.hr_payroll_management_system.controller.dashboard;

import com.hrms.hr_payroll_management_system.dto.response.dashboard.AttendanceDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.DashboardSummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.EmployeeDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.LeaveDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.OrganizationDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.PayrollDashboardResponse;
import com.hrms.hr_payroll_management_system.service.dashboard.DashboardService;
import com.hrms.hr_payroll_management_system.dto.response.announcement.AnnouncementResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.ComplianceAlertResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.RecruitmentPipelineResponse;
import lombok.RequiredArgsConstructor;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.PendingApprovalsResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.UpcomingBirthdayResponse;
import com.hrms.hr_payroll_management_system.dto.response.holiday.HolidayResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.AttendanceTrendPointResponse;
import java.util.List;
import java.time.LocalDate;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.RecentActivityResponse;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard statistics APIs")
@PreAuthorize("hasRole('ADMIN') or hasAuthority('DASHBOARD_VIEW')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get overall dashboard summary, optionally filtered by department")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @RequestParam(required = false) Long departmentId
    ) {
        return ResponseEntity.ok(dashboardService.getSummary(departmentId));
    }

    @GetMapping("/employees")
    @Operation(summary = "Get employee statistics, optionally filtered by department")
    public ResponseEntity<EmployeeDashboardResponse> getEmployeeStats(
            @RequestParam(required = false) Long departmentId
    ) {
        return ResponseEntity.ok(dashboardService.getEmployeeStats(departmentId));
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
    @GetMapping("/pending-approvals")
    @Operation(summary = "Get counts of items awaiting approval across modules")
    public ResponseEntity<PendingApprovalsResponse> getPendingApprovals() {
        return ResponseEntity.ok(dashboardService.getPendingApprovals());
    }
    @GetMapping("/recruitment-pipeline")
    @Operation(summary = "Get current application counts per recruitment stage")
    public ResponseEntity<RecruitmentPipelineResponse> getRecruitmentPipeline() {
        return ResponseEntity.ok(dashboardService.getRecruitmentPipeline());
    }

    @GetMapping("/training-completion")
    @Operation(summary = "Get overall training completion percentage")
    public ResponseEntity<Integer> getTrainingCompletion() {
        return ResponseEntity.ok(dashboardService.getTrainingCompletion());
    }
    @GetMapping("/upcoming-holidays")
    @Operation(summary = "Get the next few upcoming holidays")
    public ResponseEntity<List<HolidayResponse>> getUpcomingHolidays(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(dashboardService.getUpcomingHolidays(limit));
    }

    @GetMapping("/birthdays")
    @Operation(summary = "Get active employees with a birthday this month")
    public ResponseEntity<List<UpcomingBirthdayResponse>> getBirthdaysThisMonth() {
        return ResponseEntity.ok(dashboardService.getBirthdaysThisMonth());
    }
    @GetMapping("/recent-announcements")
    @Operation(summary = "Get the latest active announcements")
    public ResponseEntity<List<AnnouncementResponse>> getRecentAnnouncements(
            @RequestParam(defaultValue = "4") int limit
    ) {
        return ResponseEntity.ok(dashboardService.getRecentAnnouncements(limit));
    }

    @GetMapping("/compliance-alerts")
    @Operation(summary = "Get employee documents expiring within 30 days")
    public ResponseEntity<List<ComplianceAlertResponse>> getComplianceAlerts() {
        return ResponseEntity.ok(dashboardService.getComplianceAlerts());
    }
    @GetMapping("/recent-activity")
    @Operation(summary = "Get the latest audit log entries across the system")
    public ResponseEntity<List<RecentActivityResponse>> getRecentActivity(
            @RequestParam(defaultValue = "8") int limit
    ) {
        return ResponseEntity.ok(dashboardService.getRecentActivity(limit));
    }
    @GetMapping("/attendance/trend")
    @Operation(summary = "Get attendance present/absent/late counts for the last N days")
    public ResponseEntity<List<AttendanceTrendPointResponse>> getAttendanceTrend(
            @RequestParam(defaultValue = "7") int days
    ) {
        return ResponseEntity.ok(dashboardService.getAttendanceTrend(days));
    }
}
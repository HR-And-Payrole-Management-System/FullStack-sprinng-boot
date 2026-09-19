package com.hrms.hr_payroll_management_system.controller.analytics;

import com.hrms.hr_payroll_management_system.dto.response.analytics.AnalyticsPointResponse;
import com.hrms.hr_payroll_management_system.dto.response.analytics.AttendanceTrendPointResponse;
import com.hrms.hr_payroll_management_system.service.analytics.AnalyticsService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasAuthority('ANALYTICS_VIEW')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/payroll-cost-trend")
    public ResponseEntity<List<AnalyticsPointResponse>> getPayrollCostTrend(
            @RequestParam(defaultValue = "6") int months
    ) {
        return ResponseEntity.ok(analyticsService.getPayrollCostTrend(months));
    }

    @GetMapping("/payroll-cost-by-department")
    public ResponseEntity<List<AnalyticsPointResponse>> getPayrollCostByDepartment() {
        return ResponseEntity.ok(analyticsService.getPayrollCostByDepartment());
    }

    @GetMapping("/leave-utilization-by-type")
    public ResponseEntity<List<AnalyticsPointResponse>> getLeaveUtilizationByType() {
        return ResponseEntity.ok(analyticsService.getLeaveUtilizationByType());
    }

    @GetMapping("/leave-utilization-by-department")
    public ResponseEntity<List<AnalyticsPointResponse>> getLeaveUtilizationByDepartment() {
        return ResponseEntity.ok(analyticsService.getLeaveUtilizationByDepartment());
    }

    @GetMapping("/attendance-trend")
    public ResponseEntity<List<AttendanceTrendPointResponse>> getAttendanceTrend(
            @RequestParam(defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(analyticsService.getAttendanceTrend(days));
    }

    @GetMapping("/recruitment-funnel")
    public ResponseEntity<List<AnalyticsPointResponse>> getRecruitmentFunnel() {
        return ResponseEntity.ok(analyticsService.getRecruitmentFunnel());
    }
}
package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.dto.response.workforce.ChartPointResponse;
import com.hrms.hr_payroll_management_system.service.WorkforceInsightsService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard/workforce")
@RequiredArgsConstructor
@Tag(name = "Workforce Insights", description = "Aggregated workforce analytics for the dashboard")
@PreAuthorize("hasRole('ADMIN') or hasAuthority('DASHBOARD_VIEW')")
public class WorkforceInsightsController {

    private final WorkforceInsightsService workforceInsightsService;

    @GetMapping("/trend")
    public ResponseEntity<List<ChartPointResponse>> getTrend() {
        return ResponseEntity.ok(workforceInsightsService.getEmployeeTrend());
    }

    @GetMapping("/attrition-by-department")
    public ResponseEntity<List<ChartPointResponse>> getAttritionByDepartment() {
        return ResponseEntity.ok(workforceInsightsService.getAttritionByDepartment());
    }

    @GetMapping("/attrition-by-position")
    public ResponseEntity<List<ChartPointResponse>> getAttritionByPosition() {
        return ResponseEntity.ok(workforceInsightsService.getAttritionByPosition());
    }


    @GetMapping("/age-groups")
    public ResponseEntity<List<ChartPointResponse>> getAgeGroups() {
        return ResponseEntity.ok(workforceInsightsService.getAgeGroups());
    }

    @GetMapping("/gender-diversity")
    public ResponseEntity<List<ChartPointResponse>> getGenderDiversity() {
        return ResponseEntity.ok(workforceInsightsService.getGenderDiversity());
    }

    @GetMapping("/tenure-distribution")
    public ResponseEntity<List<ChartPointResponse>> getTenureDistribution() {
        return ResponseEntity.ok(workforceInsightsService.getTenureDistribution());
    }
}
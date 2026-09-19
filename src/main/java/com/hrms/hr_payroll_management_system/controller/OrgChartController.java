package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.response.orgchart.OrgChartNodeResponse;
import com.hrms.hr_payroll_management_system.service.OrgChartService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/org-chart")
@RequiredArgsConstructor
public class OrgChartController {

    private final OrgChartService orgChartService;

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<OrgChartNodeResponse>>> getCompanyChart(
            @PathVariable Long companyId
    ) {
        return ResponseEntity.ok(
                ApiResponse.<List<OrgChartNodeResponse>>builder()
                        .success(true)
                        .message("Org chart retrieved successfully.")
                        .data(orgChartService.getCompanyOrgChart(companyId))
                        .build()
        );
    }

    @GetMapping("/employee/{employeeId}/subtree")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<OrgChartNodeResponse>> getSubTree(
            @PathVariable Long employeeId
    ) {
        return ResponseEntity.ok(
                ApiResponse.<OrgChartNodeResponse>builder()
                        .success(true)
                        .message("Sub-tree retrieved successfully.")
                        .data(orgChartService.getSubTree(employeeId))
                        .build()
        );
    }
}
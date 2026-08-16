package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.response.organization.OrganizationSummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.organization.OrganizationTreeResponse;
import com.hrms.hr_payroll_management_system.service.OrganizationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping("/summary")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('ORGANIZATION_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<OrganizationSummaryResponse>
            > getSummary() {

        return ResponseEntity.ok(
                ApiResponse
                        .<OrganizationSummaryResponse>builder()
                        .success(true)
                        .message(
                                "Organization summary retrieved successfully."
                        )
                        .data(
                                organizationService.getSummary()
                        )
                        .build()
        );
    }

    @GetMapping("/tree/{companyId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('ORGANIZATION_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<OrganizationTreeResponse>
            > getOrganizationTree(
            @PathVariable Long companyId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<OrganizationTreeResponse>builder()
                        .success(true)
                        .message(
                                "Organization tree retrieved successfully."
                        )
                        .data(
                                organizationService
                                        .getOrganizationTree(
                                                companyId
                                        )
                        )
                        .build()
        );
    }
}
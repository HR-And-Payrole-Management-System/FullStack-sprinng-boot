package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.integration.ConnectIntegrationRequest;
import com.hrms.hr_payroll_management_system.dto.request.integration.CreateIntegrationRequest;
import com.hrms.hr_payroll_management_system.dto.response.integration.IntegrationResponse;
import com.hrms.hr_payroll_management_system.dto.response.integration.IntegrationSummaryResponse;
import com.hrms.hr_payroll_management_system.service.IntegrationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/integrations")
@RequiredArgsConstructor
public class IntegrationController {

    private final IntegrationService integrationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('INTEGRATION_VIEW')")
    public ResponseEntity<ApiResponse<List<IntegrationResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.<List<IntegrationResponse>>builder()
                        .success(true)
                        .message("Integrations retrieved successfully.")
                        .data(integrationService.getAll())
                        .build()
        );
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('INTEGRATION_VIEW')")
    public ResponseEntity<ApiResponse<IntegrationSummaryResponse>> getSummary() {
        return ResponseEntity.ok(
                ApiResponse.<IntegrationSummaryResponse>builder()
                        .success(true)
                        .message("Integration summary retrieved successfully.")
                        .data(integrationService.getSummary())
                        .build()
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('INTEGRATION_MANAGE')")
    public ResponseEntity<ApiResponse<IntegrationResponse>> create(
            @Valid @RequestBody CreateIntegrationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<IntegrationResponse>builder()
                        .success(true)
                        .message("Integration added successfully.")
                        .data(integrationService.create(request))
                        .build()
        );
    }

    @PostMapping("/{id}/connect")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('INTEGRATION_MANAGE')")
    public ResponseEntity<ApiResponse<IntegrationResponse>> connect(
            @PathVariable Long id,
            @Valid @RequestBody ConnectIntegrationRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ApiResponse.<IntegrationResponse>builder()
                        .success(true)
                        .message("Integration connected successfully.")
                        .data(integrationService.connect(id, request, authentication.getName()))
                        .build()
        );
    }

    @PostMapping("/{id}/disconnect")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('INTEGRATION_MANAGE')")
    public ResponseEntity<ApiResponse<IntegrationResponse>> disconnect(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.<IntegrationResponse>builder()
                        .success(true)
                        .message("Integration disconnected successfully.")
                        .data(integrationService.disconnect(id))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('INTEGRATION_MANAGE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        integrationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.onboarding.CreateOnboardingTemplateRequest;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingTemplateResponse;
import com.hrms.hr_payroll_management_system.service.OnboardingTemplateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/onboarding-templates")
@RequiredArgsConstructor
public class OnboardingTemplateController {

    private final OnboardingTemplateService templateService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OnboardingTemplateResponse>> create(
            @Valid @RequestBody CreateOnboardingTemplateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<OnboardingTemplateResponse>builder()
                        .success(true).message("Template created.")
                        .data(templateService.create(request)).build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<OnboardingTemplateResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<OnboardingTemplateResponse>>builder()
                .success(true).message("Templates retrieved.")
                .data(templateService.getAllActive()).build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<OnboardingTemplateResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<OnboardingTemplateResponse>builder()
                .success(true).message("Template retrieved.")
                .data(templateService.getById(id)).build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OnboardingTemplateResponse>> update(
            @PathVariable Long id, @Valid @RequestBody CreateOnboardingTemplateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.<OnboardingTemplateResponse>builder()
                .success(true).message("Template updated.")
                .data(templateService.update(id, request)).build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        templateService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("Template deactivated.").build());
    }
}
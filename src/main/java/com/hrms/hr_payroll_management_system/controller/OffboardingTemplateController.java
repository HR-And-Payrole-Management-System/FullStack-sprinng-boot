package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.offboarding.CreateOffboardingTemplateRequest;
import com.hrms.hr_payroll_management_system.dto.response.offboarding.OffboardingTemplateResponse;
import com.hrms.hr_payroll_management_system.service.OffboardingTemplateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/offboarding-templates")
@RequiredArgsConstructor
public class OffboardingTemplateController {

    private final OffboardingTemplateService templateService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OffboardingTemplateResponse>> create(
            @Valid @RequestBody CreateOffboardingTemplateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<OffboardingTemplateResponse>builder()
                        .success(true).message("Template created.")
                        .data(templateService.create(request)).build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<OffboardingTemplateResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<OffboardingTemplateResponse>>builder()
                .success(true).message("Templates retrieved.")
                .data(templateService.getAllActive()).build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        templateService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("Template deactivated.").build());
    }
}
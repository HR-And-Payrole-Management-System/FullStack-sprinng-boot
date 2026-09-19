package com.hrms.hr_payroll_management_system.controller.compliance;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.compliance.CreateComplianceRequirementRequest;
import com.hrms.hr_payroll_management_system.dto.response.compliance.ComplianceRequirementResponse;
import com.hrms.hr_payroll_management_system.service.compliance.ComplianceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/compliance")
@RequiredArgsConstructor
public class ComplianceController {

    private final ComplianceService complianceService;

    @PostMapping("/requirements")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<ComplianceRequirementResponse>> create(
            @Valid @RequestBody CreateComplianceRequirementRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ComplianceRequirementResponse>builder()
                .success(true).message("Compliance requirement created.").data(complianceService.create(request)).build());
    }

    @GetMapping("/requirements")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<ComplianceRequirementResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<ComplianceRequirementResponse>>builder()
                .success(true).message("Compliance requirements retrieved.").data(complianceService.getAll()).build());
    }

    @GetMapping("/requirements/issues")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<List<ComplianceRequirementResponse>>> getIssues() {
        return ResponseEntity.ok(ApiResponse.<List<ComplianceRequirementResponse>>builder()
                .success(true).message("Non-compliant requirements retrieved.").data(complianceService.getNonCompliantOnly()).build());
    }
    @PutMapping("/requirements/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<ComplianceRequirementResponse>> update(
            @PathVariable Long id, @Valid @RequestBody CreateComplianceRequirementRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.<ComplianceRequirementResponse>builder()
                .success(true).message("Compliance requirement updated.").data(complianceService.update(id, request)).build());
    }

    @DeleteMapping("/requirements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        complianceService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Compliance requirement deleted.").build());
    }
}
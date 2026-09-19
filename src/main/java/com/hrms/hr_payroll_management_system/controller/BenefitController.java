package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.benefit.CreateBenefitRuleRequest;
import com.hrms.hr_payroll_management_system.dto.request.benefit.EnrollBenefitRequest;
import com.hrms.hr_payroll_management_system.dto.response.benefit.BenefitEnrollmentResponse;
import com.hrms.hr_payroll_management_system.dto.response.benefit.BenefitRuleResponse;
import com.hrms.hr_payroll_management_system.service.BenefitEnrollmentService;
import com.hrms.hr_payroll_management_system.service.BenefitRuleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/benefits")
@RequiredArgsConstructor
public class BenefitController {

    private final BenefitRuleService benefitRuleService;
    private final BenefitEnrollmentService benefitEnrollmentService;

    @PostMapping("/rules")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BenefitRuleResponse>> createRule(@Valid @RequestBody CreateBenefitRuleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<BenefitRuleResponse>builder()
                .success(true).message("Benefit rule created.").data(benefitRuleService.create(request)).build());
    }

    @GetMapping("/rules")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<BenefitRuleResponse>>> getRules() {
        return ResponseEntity.ok(ApiResponse.<List<BenefitRuleResponse>>builder()
                .success(true).message("Benefit rules retrieved.").data(benefitRuleService.getAll()).build());
    }

    @DeleteMapping("/rules/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivateRule(@PathVariable Long id) {
        benefitRuleService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Benefit rule deactivated.").build());
    }

    @PostMapping("/enroll")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<BenefitEnrollmentResponse>> enroll(@Valid @RequestBody EnrollBenefitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<BenefitEnrollmentResponse>builder()
                .success(true).message("Employee enrolled.").data(benefitEnrollmentService.enroll(request)).build());
    }

    @PutMapping("/enrollments/{id}/waive")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<BenefitEnrollmentResponse>> waive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<BenefitEnrollmentResponse>builder()
                .success(true).message("Enrollment waived.").data(benefitEnrollmentService.waive(id)).build());
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<BenefitEnrollmentResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.<List<BenefitEnrollmentResponse>>builder()
                .success(true).message("Enrollments retrieved.").data(benefitEnrollmentService.getByEmployee(employeeId)).build());
    }
}
package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.onboarding.StartOnboardingRequest;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingProcessResponse;
import com.hrms.hr_payroll_management_system.service.OnboardingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingService onboardingService;

    @PostMapping("/start")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OnboardingProcessResponse>> start(
            @Valid @RequestBody StartOnboardingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<OnboardingProcessResponse>builder()
                        .success(true).message("Onboarding started.")
                        .data(onboardingService.start(request)).build());
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<OnboardingProcessResponse>> getByEmployee(
            @PathVariable Long employeeId
    ) {
        return ResponseEntity.ok(ApiResponse.<OnboardingProcessResponse>builder()
                .success(true).message("Onboarding retrieved.")
                .data(onboardingService.getByEmployeeId(employeeId)).build());
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<OnboardingProcessResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.<List<OnboardingProcessResponse>>builder()
                .success(true).message("Active onboarding processes retrieved.")
                .data(onboardingService.getActiveProcesses()).build());
    }

    @PutMapping("/task/{taskId}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OnboardingProcessResponse>> completeTask(
            @PathVariable Long taskId,
            @RequestParam(required = false) Long completedByEmployeeId
    ) {
        return ResponseEntity.ok(ApiResponse.<OnboardingProcessResponse>builder()
                .success(true).message("Task marked complete.")
                .data(onboardingService.completeTask(taskId, completedByEmployeeId)).build());
    }

    @PutMapping("/task/{taskId}/skip")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OnboardingProcessResponse>> skipTask(
            @PathVariable Long taskId
    ) {
        return ResponseEntity.ok(ApiResponse.<OnboardingProcessResponse>builder()
                .success(true).message("Task skipped.")
                .data(onboardingService.skipTask(taskId)).build());
    }
    @GetMapping("/completed")
        @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
        public ResponseEntity<ApiResponse<List<OnboardingProcessResponse>>> getCompleted() {
        return ResponseEntity.ok(ApiResponse.<List<OnboardingProcessResponse>>builder()
                .success(true).message("Completed onboarding processes retrieved.")
                .data(onboardingService.getCompletedProcesses()).build());
        }
}
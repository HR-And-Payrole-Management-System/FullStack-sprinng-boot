package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.offboarding.StartOffboardingRequest;
import com.hrms.hr_payroll_management_system.dto.response.offboarding.OffboardingProcessResponse;
import com.hrms.hr_payroll_management_system.service.OffboardingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/offboarding")
@RequiredArgsConstructor
public class OffboardingController {

    private final OffboardingService offboardingService;

    @PostMapping("/start")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OffboardingProcessResponse>> start(
            @Valid @RequestBody StartOffboardingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<OffboardingProcessResponse>builder()
                        .success(true).message("Offboarding started.")
                        .data(offboardingService.start(request)).build());
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<OffboardingProcessResponse>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.<OffboardingProcessResponse>builder()
                .success(true).message("Offboarding retrieved.")
                .data(offboardingService.getByEmployeeId(employeeId)).build());
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<OffboardingProcessResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.<List<OffboardingProcessResponse>>builder()
                .success(true).message("Active offboarding processes retrieved.")
                .data(offboardingService.getActiveProcesses()).build());
    }

    @PutMapping("/task/{taskId}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OffboardingProcessResponse>> completeTask(
            @PathVariable Long taskId, @RequestParam(required = false) Long completedByEmployeeId
    ) {
        return ResponseEntity.ok(ApiResponse.<OffboardingProcessResponse>builder()
                .success(true).message("Task marked complete.")
                .data(offboardingService.completeTask(taskId, completedByEmployeeId)).build());
    }

    @PutMapping("/task/{taskId}/skip")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<OffboardingProcessResponse>> skipTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(ApiResponse.<OffboardingProcessResponse>builder()
                .success(true).message("Task skipped.")
                .data(offboardingService.skipTask(taskId)).build());
    }
    @GetMapping("/completed")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<OffboardingProcessResponse>>> getCompleted() {
        return ResponseEntity.ok(ApiResponse.<List<OffboardingProcessResponse>>builder()
                .success(true).message("Completed offboarding processes retrieved.")
                .data(offboardingService.getCompletedProcesses()).build());
    }
}
package com.hrms.hr_payroll_management_system.controller.performance;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.performance.CreatePerformanceGoalRequest;
import com.hrms.hr_payroll_management_system.dto.request.performance.UpdateGoalProgressRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceGoalResponse;
import com.hrms.hr_payroll_management_system.service.performance.PerformanceGoalService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/performance-goals")
@RequiredArgsConstructor
public class PerformanceGoalController {

    private final PerformanceGoalService service;

    @PostMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_CREATE')"
    )
    public ResponseEntity<ApiResponse<PerformanceGoalResponse>> create(
            @PathVariable Long employeeId,
            @Valid @RequestBody CreatePerformanceGoalRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<PerformanceGoalResponse>builder()
                                .success(true)
                                .message(
                                        "Performance goal created successfully."
                                )
                                .data(
                                        service.create(
                                                employeeId,
                                                request
                                        )
                                )
                                .build()
                );
    }

    @PutMapping("/{id}/progress")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<PerformanceGoalResponse>> progress(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGoalProgressRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<PerformanceGoalResponse>builder()
                        .success(true)
                        .message(
                                "Performance goal progress updated."
                        )
                        .data(
                                service.updateProgress(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @GetMapping("/employees/{employeeId}/cycles/{cycleId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<PerformanceGoalResponse>>
            > getEmployeeGoals(
            @PathVariable Long employeeId,
            @PathVariable Long cycleId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<PerformanceGoalResponse>>builder()
                        .success(true)
                        .message(
                                "Employee goals retrieved successfully."
                        )
                        .data(
                                service.getEmployeeGoals(
                                        employeeId,
                                        cycleId
                                )
                        )
                        .build()
        );
    }
}
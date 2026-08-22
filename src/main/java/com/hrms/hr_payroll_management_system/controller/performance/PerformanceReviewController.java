package com.hrms.hr_payroll_management_system.controller.performance;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.performance.ManagerReviewRequest;
import com.hrms.hr_payroll_management_system.dto.request.performance.SelfReviewRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceReviewResponse;
import com.hrms.hr_payroll_management_system.service.performance.PerformanceReviewService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/performance-reviews")
@RequiredArgsConstructor
public class PerformanceReviewController {

    private final PerformanceReviewService service;

    @PutMapping(
            "/employees/{employeeId}/cycles/{cycleId}/self-review"
    )
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<PerformanceReviewResponse>> selfReview(
            @PathVariable Long employeeId,
            @PathVariable Long cycleId,
            @Valid @RequestBody SelfReviewRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<PerformanceReviewResponse>builder()
                        .success(true)
                        .message(
                                "Self review submitted successfully."
                        )
                        .data(
                                service.selfReview(
                                        employeeId,
                                        cycleId,
                                        request
                                )
                        )
                        .build()
        );
    }

    @PutMapping(
            "/employees/{employeeId}/cycles/{cycleId}/manager-review"
    )
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_REVIEW')"
    )
    public ResponseEntity<ApiResponse<PerformanceReviewResponse>> managerReview(
            @PathVariable Long employeeId,
            @PathVariable Long cycleId,
            @Valid @RequestBody ManagerReviewRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<PerformanceReviewResponse>builder()
                        .success(true)
                        .message(
                                "Manager review submitted successfully."
                        )
                        .data(
                                service.managerReview(
                                        employeeId,
                                        cycleId,
                                        request
                                )
                        )
                        .build()
        );
    }

    @PutMapping(
            "/employees/{employeeId}/cycles/{cycleId}/complete"
    )
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_REVIEW')"
    )
    public ResponseEntity<ApiResponse<PerformanceReviewResponse>> complete(
            @PathVariable Long employeeId,
            @PathVariable Long cycleId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<PerformanceReviewResponse>builder()
                        .success(true)
                        .message(
                                "Performance review completed successfully."
                        )
                        .data(
                                service.complete(
                                        employeeId,
                                        cycleId
                                )
                        )
                        .build()
        );
    }

    @GetMapping(
            "/employees/{employeeId}/cycles/{cycleId}"
    )
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_VIEW')"
    )
    public ResponseEntity<ApiResponse<PerformanceReviewResponse>> get(
            @PathVariable Long employeeId,
            @PathVariable Long cycleId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<PerformanceReviewResponse>builder()
                        .success(true)
                        .message(
                                "Performance review retrieved successfully."
                        )
                        .data(
                                service.get(
                                        employeeId,
                                        cycleId
                                )
                        )
                        .build()
        );
    }

    @GetMapping("/employees/{employeeId}/history")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<PerformanceReviewResponse>>
            > history(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<PerformanceReviewResponse>>builder()
                        .success(true)
                        .message(
                                "Performance history retrieved successfully."
                        )
                        .data(
                                service.getHistory(
                                        employeeId
                                )
                        )
                        .build()
        );
    }
}
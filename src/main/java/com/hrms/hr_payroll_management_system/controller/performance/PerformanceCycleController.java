package com.hrms.hr_payroll_management_system.controller.performance;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.performance.CreatePerformanceCycleRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceCycleResponse;
import com.hrms.hr_payroll_management_system.service.performance.PerformanceCycleService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/performance-cycles")
@RequiredArgsConstructor
public class PerformanceCycleController {

    private final PerformanceCycleService service;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_CREATE')"
    )
    public ResponseEntity<ApiResponse<PerformanceCycleResponse>> create(
            @Valid @RequestBody CreatePerformanceCycleRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<PerformanceCycleResponse>builder()
                                .success(true)
                                .message(
                                        "Performance cycle created successfully."
                                )
                                .data(service.create(request))
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<PerformanceCycleResponse>>
            > getAll() {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<PerformanceCycleResponse>>builder()
                        .success(true)
                        .message(
                                "Performance cycles retrieved successfully."
                        )
                        .data(service.getAll())
                        .build()
        );
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<PerformanceCycleResponse>> activate(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<PerformanceCycleResponse>builder()
                        .success(true)
                        .message(
                                "Performance cycle activated."
                        )
                        .data(service.activate(id))
                        .build()
        );
    }

    @PutMapping("/{id}/close")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PERFORMANCE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<PerformanceCycleResponse>> close(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<PerformanceCycleResponse>builder()
                        .success(true)
                        .message(
                                "Performance cycle closed."
                        )
                        .data(service.close(id))
                        .build()
        );
    }
}
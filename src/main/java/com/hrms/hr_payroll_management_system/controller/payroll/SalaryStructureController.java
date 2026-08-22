package com.hrms.hr_payroll_management_system.controller.payroll;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.payroll.CreateSalaryStructureRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.SalaryStructureResponse;
import com.hrms.hr_payroll_management_system.service.payroll.SalaryStructureService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salary-structures")
@RequiredArgsConstructor
public class SalaryStructureController {

    private final SalaryStructureService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PAYROLL_CREATE')")
    public ResponseEntity<ApiResponse<SalaryStructureResponse>> create(
            @Valid @RequestBody CreateSalaryStructureRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<SalaryStructureResponse>builder()
                                .success(true)
                                .message("Salary structure created successfully.")
                                .data(service.create(request))
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PAYROLL_VIEW')")
    public ResponseEntity<ApiResponse<List<SalaryStructureResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<SalaryStructureResponse>>builder()
                        .success(true)
                        .message("Salary structures retrieved successfully.")
                        .data(service.getAll())
                        .build()
        );
    }
}
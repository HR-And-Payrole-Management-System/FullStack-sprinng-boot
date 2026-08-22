package com.hrms.hr_payroll_management_system.controller.payroll;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.payroll.GeneratePayrollRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.PayrollResponse;
import com.hrms.hr_payroll_management_system.service.payroll.PayrollService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payrolls")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/generate")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_CREATE')"
    )
    public ResponseEntity<ApiResponse<PayrollResponse>> generate(
            @Valid @RequestBody GeneratePayrollRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<PayrollResponse>builder()
                                .success(true)
                                .message(
                                        "Payroll generated successfully."
                                )
                                .data(
                                        payrollService.generate(request)
                                )
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<PayrollResponse>>builder()
                        .success(true)
                        .message(
                                "Payrolls retrieved successfully."
                        )
                        .data(payrollService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_VIEW')"
    )
    public ResponseEntity<ApiResponse<PayrollResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<PayrollResponse>builder()
                        .success(true)
                        .message(
                                "Payroll retrieved successfully."
                        )
                        .data(
                                payrollService.getById(id)
                        )
                        .build()
        );
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_APPROVE')"
    )
    public ResponseEntity<ApiResponse<PayrollResponse>> approve(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<PayrollResponse>builder()
                        .success(true)
                        .message(
                                "Payroll approved successfully."
                        )
                        .data(
                                payrollService.approve(id)
                        )
                        .build()
        );
    }

    @PutMapping("/{id}/paid")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_PAY')"
    )
    public ResponseEntity<ApiResponse<PayrollResponse>> paid(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<PayrollResponse>builder()
                        .success(true)
                        .message(
                                "Payroll marked as paid."
                        )
                        .data(
                                payrollService.markPaid(id)
                        )
                        .build()
        );
    }
}
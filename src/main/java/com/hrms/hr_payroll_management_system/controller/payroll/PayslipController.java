package com.hrms.hr_payroll_management_system.controller.payroll;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.response.payroll.PayslipResponse;
import com.hrms.hr_payroll_management_system.service.payroll.PayslipService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payslips")
@RequiredArgsConstructor
public class PayslipController {

    private final PayslipService payslipService;

    @GetMapping("/{payrollId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_VIEW')"
    )
    public ResponseEntity<ApiResponse<PayslipResponse>> get(
            @PathVariable Long payrollId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<PayslipResponse>builder()
                        .success(true)
                        .message(
                                "Payslip retrieved successfully."
                        )
                        .data(
                                payslipService
                                        .getPayslip(payrollId)
                        )
                        .build()
        );
    }
}
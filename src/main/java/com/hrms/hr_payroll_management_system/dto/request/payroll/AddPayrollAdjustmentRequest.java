package com.hrms.hr_payroll_management_system.dto.request.payroll;

import com.hrms.hr_payroll_management_system.enums.AdjustmentType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AddPayrollAdjustmentRequest {

    @NotNull
    private AdjustmentType type;

    @NotBlank
    private String name;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal amount;

    @NotNull
    private LocalDate effectiveDate;
}
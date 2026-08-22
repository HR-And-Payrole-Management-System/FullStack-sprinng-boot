package com.hrms.hr_payroll_management_system.dto.request.payroll;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateSalaryStructureRequest {

    @NotBlank
    private String name;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal basicSalary;

    @DecimalMin("0.0")
    private BigDecimal housingAllowance = BigDecimal.ZERO;

    @DecimalMin("0.0")
    private BigDecimal transportAllowance = BigDecimal.ZERO;

    @DecimalMin("0.0")
    private BigDecimal mealAllowance = BigDecimal.ZERO;
}
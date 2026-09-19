package com.hrms.hr_payroll_management_system.dto.request.benefit;

import com.hrms.hr_payroll_management_system.enums.BenefitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBenefitRuleRequest {

    @NotBlank
    private String name;

    @NotNull
    private BenefitType type;

    private BigDecimal percentage;

    private BigDecimal fixedAmount;
}
package com.hrms.hr_payroll_management_system.dto.response.benefit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenefitRuleResponse {
    private Long id;
    private String name;
    private String type;
    private BigDecimal percentage;
    private BigDecimal fixedAmount;
    private boolean active;
}
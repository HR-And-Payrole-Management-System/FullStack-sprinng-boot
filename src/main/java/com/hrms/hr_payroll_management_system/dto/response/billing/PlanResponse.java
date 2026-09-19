package com.hrms.hr_payroll_management_system.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PlanResponse {
    private String planKey;
    private String planName;
    private BigDecimal monthlyPrice;
    private Integer employeeLimit;
    private List<String> features;
    private Boolean highlighted;
}
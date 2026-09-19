package com.hrms.hr_payroll_management_system.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class BillingSummaryResponse {
    private String currentPlanName;
    private long employeesUsed;
    private int employeeLimit;
    private String nextBillingDate;
    private BigDecimal totalSpent;
}
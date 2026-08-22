package com.hrms.hr_payroll_management_system.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollDashboardResponse {

    private long totalPayroll;
    private long calculated;
    private long approved;
    private long paid;

    private BigDecimal grossSalary;
    private BigDecimal totalDeduction;
    private BigDecimal netSalary;
}
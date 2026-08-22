package com.hrms.hr_payroll_management_system.dto.response.report;

import com.hrms.hr_payroll_management_system.enums.PayrollStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollReportResponse {

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private Integer year;
    private Integer month;

    private BigDecimal basicSalary;
    private BigDecimal totalAllowance;
    private BigDecimal overtimePay;
    private BigDecimal taxAmount;
    private BigDecimal totalDeduction;
    private BigDecimal grossSalary;
    private BigDecimal netSalary;

    private PayrollStatus status;
}
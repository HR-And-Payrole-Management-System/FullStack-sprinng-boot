package com.hrms.hr_payroll_management_system.dto.response.payroll;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PayrollResponse {

    private Long id;

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private Integer year;
    private Integer month;

    private BigDecimal basicSalary;
    private BigDecimal totalAllowance;
    private BigDecimal totalDeduction;
    private BigDecimal overtimePay;

    private BigDecimal grossSalary;
    private BigDecimal netSalary;

    private String status;

    private BigDecimal taxAmount;

    private BigDecimal employeeContribution;

    private BigDecimal employerContribution;
}
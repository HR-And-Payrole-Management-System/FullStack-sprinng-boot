package com.hrms.hr_payroll_management_system.dto.response.payroll;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PayslipResponse {

    private Long payrollId;

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private Integer year;
    private Integer month;

    private BigDecimal basicSalary;

    private BigDecimal allowance;
    private BigDecimal overtimePay;

    private BigDecimal grossSalary;

    private BigDecimal tax;
    private BigDecimal employeeContribution;
    private BigDecimal otherDeduction;

    private BigDecimal employerContribution;

    private BigDecimal netSalary;

    private String status;
}
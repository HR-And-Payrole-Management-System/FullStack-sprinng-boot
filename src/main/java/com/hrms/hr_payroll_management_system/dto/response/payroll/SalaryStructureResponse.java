package com.hrms.hr_payroll_management_system.dto.response.payroll;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SalaryStructureResponse {

    private Long id;
    private String name;

    private BigDecimal basicSalary;
    private BigDecimal housingAllowance;
    private BigDecimal transportAllowance;
    private BigDecimal mealAllowance;

    private String status;
}
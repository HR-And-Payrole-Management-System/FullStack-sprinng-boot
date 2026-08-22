package com.hrms.hr_payroll_management_system.dto.response.payroll;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class EmployeeSalaryResponse {

    private Long id;

    private Long employeeId;
    private String employeeCode;

    private Long salaryStructureId;
    private String salaryStructureName;

    private BigDecimal basicSalary;

    private LocalDate effectiveDate;
    private LocalDate endDate;
}
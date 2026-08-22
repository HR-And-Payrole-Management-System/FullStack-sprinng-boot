package com.hrms.hr_payroll_management_system.dto.request.payroll;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AssignEmployeeSalaryRequest {

    @NotNull
    private Long salaryStructureId;

    @NotNull
    private LocalDate effectiveDate;

    private LocalDate endDate;
}
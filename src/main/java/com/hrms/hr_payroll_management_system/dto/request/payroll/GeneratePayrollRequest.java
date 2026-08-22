package com.hrms.hr_payroll_management_system.dto.request.payroll;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GeneratePayrollRequest {

    @NotNull
    private Long employeeId;

    @NotNull
    @Min(2000)
    private Integer year;

    @NotNull
    @Min(1)
    @Max(12)
    private Integer month;
}
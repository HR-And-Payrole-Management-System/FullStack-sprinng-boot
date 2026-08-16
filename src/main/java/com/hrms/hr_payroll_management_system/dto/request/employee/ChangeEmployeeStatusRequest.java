package com.hrms.hr_payroll_management_system.dto.request.employee;

import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ChangeEmployeeStatusRequest {

    @NotNull(message = "Employee status is required")
    private EmployeeStatus status;

    @NotNull(message = "Effective date is required")
    private LocalDate effectiveDate;

    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;
}
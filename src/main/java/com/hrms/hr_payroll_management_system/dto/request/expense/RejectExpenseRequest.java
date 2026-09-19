package com.hrms.hr_payroll_management_system.dto.request.expense;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class RejectExpenseRequest {
    @NotBlank(message = "A rejecttion reason is required")
    private String reason;
}

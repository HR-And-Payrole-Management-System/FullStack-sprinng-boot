package com.hrms.hr_payroll_management_system.dto.request.expense;

import com.hrms.hr_payroll_management_system.enums.ExpenseCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SubmitExpenseRequest {

    @NotNull
    private Long employeeId;

    @NotNull
    private ExpenseCategory category;

    @NotNull
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String description;

    @NotNull
    private LocalDate expenseDate;

    private String receiptUrl;
}
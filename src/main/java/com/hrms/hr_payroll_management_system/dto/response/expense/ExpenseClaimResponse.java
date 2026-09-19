package com.hrms.hr_payroll_management_system.dto.response.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseClaimResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String category;
    private BigDecimal amount;
    private String description;
    private LocalDate expenseDate;
    private String receiptUrl;
    private String status;
    private String approvedByName;
    private String rejectionReason;

    // Computed at submission time so the approver sees the policy check
    // immediately, without doing math in their head.
    private boolean overMonthlyLimit;
    private BigDecimal monthlyLimitForCategory;
    private BigDecimal monthToDateTotalForCategory;
}
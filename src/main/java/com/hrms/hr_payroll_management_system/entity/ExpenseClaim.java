package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.entity.payroll.PayrollAdjustment;
import com.hrms.hr_payroll_management_system.enums.ExpenseCategory;
import com.hrms.hr_payroll_management_system.enums.ExpenseStatus;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expense_claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseClaim extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ExpenseCategory category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(length = 500)
    private String description;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Column(name = "receipt_url", length = 500)
    private String receiptUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ExpenseStatus status = ExpenseStatus.SUBMITTED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    // Links to the payroll allowance created on approval — prevents a claim
    // from ever being reimbursed twice, and gives full audit traceability
    // from "why is this on my payslip" back to the original receipt.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_adjustment_id")
    private PayrollAdjustment payrollAdjustment;
}
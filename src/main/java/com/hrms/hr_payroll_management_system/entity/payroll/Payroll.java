package com.hrms.hr_payroll_management_system.entity.payroll;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.PayrollStatus;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "payrolls",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_payroll_employee_period",
                        columnNames = {
                                "employee_id",
                                "year",
                                "month"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(name = "basic_salary", precision = 15, scale = 2)
    private BigDecimal basicSalary;

    @Column(name = "total_allowance", precision = 15, scale = 2)
    private BigDecimal totalAllowance;

    @Column(name = "total_deduction", precision = 15, scale = 2)
    private BigDecimal totalDeduction;

    @Column(name = "overtime_pay", precision = 15, scale = 2)
    private BigDecimal overtimePay;

    @Column(name = "gross_salary", precision = 15, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "net_salary", precision = 15, scale = 2)
    private BigDecimal netSalary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PayrollStatus status = PayrollStatus.DRAFT;
    @Column(
        name = "tax_amount",
        precision = 15,
        scale = 2
        )
        @Builder.Default
        private BigDecimal taxAmount = BigDecimal.ZERO;

        @Column(
                name = "employee_contribution",
                precision = 15,
                scale = 2
        )
        @Builder.Default
        private BigDecimal employeeContribution =
                BigDecimal.ZERO;

        @Column(
                name = "employer_contribution",
                precision = 15,
                scale = 2
        )
        @Builder.Default
        private BigDecimal employerContribution =
                BigDecimal.ZERO;

       

        
}
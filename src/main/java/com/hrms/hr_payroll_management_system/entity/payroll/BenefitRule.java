package com.hrms.hr_payroll_management_system.entity.payroll;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.BenefitType;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "benefit_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BenefitRule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private BenefitType type;

    @Column(
            name = "percentage",
            precision = 6,
            scale = 2
    )
    private BigDecimal percentage;

    @Column(
            name = "fixed_amount",
            precision = 15,
            scale = 2
    )
    private BigDecimal fixedAmount;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;
}
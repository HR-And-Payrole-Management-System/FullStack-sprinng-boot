package com.hrms.hr_payroll_management_system.entity.payroll;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tax_brackets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxBracket extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "min_income",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal minIncome;

    @Column(
            name = "max_income",
            precision = 15,
            scale = 2
    )
    private BigDecimal maxIncome;

    @Column(
            nullable = false,
            precision = 6,
            scale = 2
    )
    private BigDecimal rate;
}
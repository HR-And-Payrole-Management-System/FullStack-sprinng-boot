package com.hrms.hr_payroll_management_system.entity.okr;

import com.hrms.hr_payroll_management_system.enums.KeyResultMetricType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "key_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeyResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "objective_id", nullable = false)
    private Objective objective;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "metric_type", nullable = false, length = 20)
    private KeyResultMetricType metricType;

    @Column(name = "start_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal startValue;

    @Column(name = "target_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal targetValue;

    @Column(name = "current_value", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentValue = BigDecimal.ZERO;

    @Column(length = 20)
    private String unit; // "deals", "%", "$" — display only
}
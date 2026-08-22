package com.hrms.hr_payroll_management_system.entity.performance;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.PerformanceCycleStatus;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "performance_cycles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_performance_cycle_name",
                        columnNames = "name"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceCycle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 150
    )
    private String name;

    @Column(
            name = "start_date",
            nullable = false
    )
    private LocalDate startDate;

    @Column(
            name = "end_date",
            nullable = false
    )
    private LocalDate endDate;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    @Builder.Default
    private PerformanceCycleStatus status =
            PerformanceCycleStatus.DRAFT;
}
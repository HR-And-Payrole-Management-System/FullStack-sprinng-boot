package com.hrms.hr_payroll_management_system.entity.okr;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.OkrCycleStatus;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "okr_cycles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OkrCycle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; // e.g. "Q3 2026"

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OkrCycleStatus status = OkrCycleStatus.ACTIVE;
}
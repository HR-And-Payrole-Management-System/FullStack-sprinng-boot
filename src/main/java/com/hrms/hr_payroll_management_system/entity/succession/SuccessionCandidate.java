package com.hrms.hr_payroll_management_system.entity.succession;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.PotentialRating;
import com.hrms.hr_payroll_management_system.enums.ReadinessLevel;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "succession_candidates", uniqueConstraints = @UniqueConstraint(columnNames = {"key_position_id", "employee_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuccessionCandidate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "key_position_id", nullable = false)
    private KeyPosition keyPosition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "potential_rating", nullable = false, length = 20)
    private PotentialRating potentialRating; // HR's judgment call — the one axis that can't be pulled from existing data

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReadinessLevel readiness;

    @Column(name = "development_notes", length = 1000)
    private String developmentNotes;
}
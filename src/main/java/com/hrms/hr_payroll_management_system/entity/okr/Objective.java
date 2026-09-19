package com.hrms.hr_payroll_management_system.entity.okr;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "objectives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Objective extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    private OkrCycle cycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Employee owner; // individual, or a manager owning a team-level objective

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    // Alignment: this objective ladders up into a parent (e.g. a team
    // objective aligns to the company objective). Null = top-level.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_objective_id")
    private Objective parentObjective;

    @OneToMany(mappedBy = "objective", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<KeyResult> keyResults = new ArrayList<>();

    @OneToMany(mappedBy = "parentObjective")
    @Builder.Default
    private List<Objective> alignedChildren = new ArrayList<>();
}
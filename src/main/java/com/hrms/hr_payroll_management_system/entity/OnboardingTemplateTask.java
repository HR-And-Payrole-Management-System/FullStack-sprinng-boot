package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.enums.OnboardingTaskRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "onboarding_template_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingTemplateTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private OnboardingTemplate template;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "assigned_role", nullable = false, length = 20)
    private OnboardingTaskRole assignedRole;

    // Due date = employee's hire date + this many days. Negative values mean
    // "before day one" (e.g. -3 = prep the laptop 3 days before they start).
    @Column(name = "due_offset_days", nullable = false)
    private int dueOffsetDays;

    @Column(nullable = false)
    @Builder.Default
    private boolean mandatory = true;

    @Column(name = "sequence_order", nullable = false)
    private int sequenceOrder;
}
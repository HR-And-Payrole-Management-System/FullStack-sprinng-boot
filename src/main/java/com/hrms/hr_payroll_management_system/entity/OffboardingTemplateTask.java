package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.enums.OnboardingTaskRole; // reused: same IT/HR/MANAGER/EMPLOYEE roster
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "offboarding_template_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OffboardingTemplateTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private OffboardingTemplate template;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "assigned_role", nullable = false, length = 20)
    private OnboardingTaskRole assignedRole;

    // Offset from LAST WORKING DATE, not start date — offboarding tasks are
    // usually "do this N days before/after they leave" (e.g. -5 = start
    // revoking non-critical access 5 days before departure).
    @Column(name = "due_offset_days", nullable = false)
    private int dueOffsetDays;

    @Column(nullable = false)
    @Builder.Default
    private boolean mandatory = true;

    @Column(name = "sequence_order", nullable = false)
    private int sequenceOrder;
}
package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.enums.OnboardingTaskRole;
import com.hrms.hr_payroll_management_system.enums.OffboardingTaskStatus;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "offboarding_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OffboardingTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private OffboardingProcess process;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "assigned_role", nullable = false, length = 20)
    private OnboardingTaskRole assignedRole;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private boolean mandatory;

    @Column(name = "sequence_order", nullable = false)
    private int sequenceOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OffboardingTaskStatus status = OffboardingTaskStatus.PENDING;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "completed_by")
    private Employee completedBy;
}
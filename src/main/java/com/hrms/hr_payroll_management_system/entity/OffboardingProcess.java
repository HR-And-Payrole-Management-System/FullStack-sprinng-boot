package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.OffboardingReason;
import com.hrms.hr_payroll_management_system.enums.OffboardingStatus;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "offboarding_processes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OffboardingProcess extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private OffboardingTemplate template;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OffboardingReason reason;

    @Column(name = "last_working_date", nullable = false)
    private LocalDate lastWorkingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OffboardingStatus status = OffboardingStatus.IN_PROGRESS;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "process", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OffboardingTask> tasks = new ArrayList<>();
}
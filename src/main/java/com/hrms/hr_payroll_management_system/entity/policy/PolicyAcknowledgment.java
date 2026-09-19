package com.hrms.hr_payroll_management_system.entity.policy;

import com.hrms.hr_payroll_management_system.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "policy_acknowledgments", uniqueConstraints = @UniqueConstraint(columnNames = {"policy_version_id", "employee_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyAcknowledgment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tied to the exact VERSION, not the policy — this is what forces
    // re-acknowledgment whenever a policy is updated.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_version_id", nullable = false)
    private PolicyVersion policyVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "acknowledged_at", nullable = false)
    private LocalDateTime acknowledgedAt;
}
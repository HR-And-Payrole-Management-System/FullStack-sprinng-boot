package com.hrms.hr_payroll_management_system.entity.compliance;

import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.entity.document.DocumentType;
import com.hrms.hr_payroll_management_system.entity.training.TrainingProgram;
import com.hrms.hr_payroll_management_system.enums.ComplianceRequirementType;
import com.hrms.hr_payroll_management_system.enums.Status;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "compliance_requirements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceRequirement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ComplianceRequirementType type;

    // Exactly one of these two is set, matching `type` above.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_type_id")
    private DocumentType documentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id")
    private TrainingProgram trainingProgram;

    // null = applies company-wide; set = scoped to one department.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.ACTIVE;
}
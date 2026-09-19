package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.PositionLevel;
import com.hrms.hr_payroll_management_system.enums.Status;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "job_roles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_job_role_name",
                        columnNames = "name"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRole extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 1000)
    private String responsibilities;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_level", length = 30)
    private PositionLevel level;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.ACTIVE;
}
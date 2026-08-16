package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.EmploymentType;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "employees",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_employee_code",
                        columnNames = "employee_code"
                ),
                @UniqueConstraint(
                        name = "uk_employee_email",
                        columnNames = "email"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "employee_code",
            nullable = false,
            length = 50
    )
    private String employeeCode;

    @Column(
            name = "first_name",
            nullable = false,
            length = 100
    )
    private String firstName;

    @Column(
            name = "last_name",
            nullable = false,
            length = 100
    )
    private String lastName;

    @Column(
            nullable = false,
            length = 255
    )
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 20)
    private String gender;

    @Column(
            name = "hire_date",
            nullable = false
    )
    private LocalDate hireDate;

    @Column(length = 255)
    private String address;

    @Column(
            name = "photo_url",
            length = 500
    )
    private String photoUrl;

    // =========================
    // Employment Details
    // =========================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "employment_type",
            nullable = false,
            length = 30
    )
    @Builder.Default
    private EmploymentType employmentType =
            EmploymentType.FULL_TIME;

    @Column(name = "probation_end_date")
    private LocalDate probationEndDate;

    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    // =========================
    // Organization
    // =========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "company_id")
        private Company company;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "branch_id")
        private Branch branch;

    // =========================
    // Emergency Contact
    // =========================

    @OneToOne(
            mappedBy = "employee",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private EmergencyContact emergencyContact;

    // =========================
    // Employee Lifecycle
    // =========================

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    @Builder.Default
    private EmployeeStatus status =
            EmployeeStatus.ACTIVE;

    @Column(name = "status_effective_date")
    private LocalDate statusEffectiveDate;

    @Column(name = "status_reason", length = 500)
    private String statusReason;

    @Column(name = "separation_date")
    private LocalDate separationDate;
}
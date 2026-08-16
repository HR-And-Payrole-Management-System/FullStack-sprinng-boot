package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "emergency_contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyContact extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "contact_name",
            nullable = false,
            length = 150
    )
    private String contactName;

    @Column(
            nullable = false,
            length = 50
    )
    private String relationship;

    @Column(
            nullable = false,
            length = 20
    )
    private String phone;

    @Column(length = 255)
    private String email;

    @Column(length = 255)
    private String address;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "employee_id",
            nullable = false,
            unique = true
    )
    private Employee employee;
}
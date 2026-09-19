package com.hrms.hr_payroll_management_system.entity.recognition;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "core_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoreValue extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name; // e.g. "Teamwork", "Innovation", "Ownership"

    @Column(length = 300)
    private String description;

    @Column(length = 20)
    private String icon; // emoji, kept simple — no icon library dependency
}
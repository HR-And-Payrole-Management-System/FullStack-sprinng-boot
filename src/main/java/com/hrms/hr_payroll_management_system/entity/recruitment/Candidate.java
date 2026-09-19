package com.hrms.hr_payroll_management_system.entity.recruitment;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.CandidateSource;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "resume_url", length = 1000)
    private String resumeUrl;

    @Column(name = "resume_file_name", length = 255)
    private String resumeFileName;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private CandidateSource source;

    @Column(length = 1000)
    private String notes;
}
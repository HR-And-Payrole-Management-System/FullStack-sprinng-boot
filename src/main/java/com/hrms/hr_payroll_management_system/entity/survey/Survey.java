package com.hrms.hr_payroll_management_system.entity.survey;

import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.SurveyStatus;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "surveys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Survey extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department; // null = company-wide

    @Column(nullable = false)
    @Builder.Default
    private boolean anonymous = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SurveyStatus status = SurveyStatus.DRAFT;

    @Column(name = "closes_at")
    private LocalDate closesAt;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SurveyQuestion> questions = new ArrayList<>();
}
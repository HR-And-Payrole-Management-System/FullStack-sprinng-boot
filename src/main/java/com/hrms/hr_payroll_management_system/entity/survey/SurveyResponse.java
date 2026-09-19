package com.hrms.hr_payroll_management_system.entity.survey;

import com.hrms.hr_payroll_management_system.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "survey_responses", uniqueConstraints = @UniqueConstraint(columnNames = {"survey_id", "employee_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    // Always stored — even for anonymous surveys — purely so we can
    // (a) block double submission and (b) compute an accurate response
    // rate. It is simply never surfaced in the results DTO when the
    // survey is anonymous.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SurveyAnswer> answers = new ArrayList<>();
}
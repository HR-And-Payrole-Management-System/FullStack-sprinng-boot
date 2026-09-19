package com.hrms.hr_payroll_management_system.entity.survey;

import com.hrms.hr_payroll_management_system.enums.SurveyQuestionType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @Column(nullable = false, length = 300)
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SurveyQuestionType type;

    // Comma-separated for MULTIPLE_CHOICE; null/unused otherwise. Kept
    // simple deliberately — a dedicated options table is overkill here
    // since options aren't independently referenced anywhere else.
    @Column(length = 500)
    private String options;

    @Column(name = "sequence_order", nullable = false)
    private int sequenceOrder;
}
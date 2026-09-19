package com.hrms.hr_payroll_management_system.dto.response.survey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveyResponseSummary {
    private Long id;
    private String title;
    private String description;
    private String scopeLabel;
    private boolean anonymous;
    private String status;
    private LocalDate closesAt;

    private int responseCount;
    private int totalInScope;
    private int responseRatePercent;

    private List<QuestionResultResponse> results; // filled only when requested with results
}
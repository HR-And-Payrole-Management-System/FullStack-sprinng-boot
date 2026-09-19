package com.hrms.hr_payroll_management_system.dto.response.survey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResultResponse {
    private Long questionId;
    private String text;
    private String type;

    private Double averageRating;          // RATING_1_5 only
    private Map<String, Long> optionCounts; // MULTIPLE_CHOICE only
    private List<String> textAnswers;       // TEXT only — never attributed to a name
}
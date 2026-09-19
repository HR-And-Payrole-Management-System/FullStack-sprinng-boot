package com.hrms.hr_payroll_management_system.dto.response.survey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveyDetailResponse {
    private Long id;
    private String title;
    private String description;
    private boolean anonymous;
    private List<QuestionDetail> questions;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDetail {
        private Long id;
        private String text;
        private String type;
        private List<String> options; // parsed from the comma-separated string, empty for non-MC
    }
}
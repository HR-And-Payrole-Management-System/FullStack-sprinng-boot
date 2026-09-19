package com.hrms.hr_payroll_management_system.dto.request.survey;

import com.hrms.hr_payroll_management_system.enums.SurveyQuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SurveyQuestionRequest {

    @NotBlank
    private String text;

    @NotNull
    private SurveyQuestionType type;

    private String options; // comma-separated, only for MULTIPLE_CHOICE

    private int sequenceOrder;
}
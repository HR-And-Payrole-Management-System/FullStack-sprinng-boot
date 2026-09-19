package com.hrms.hr_payroll_management_system.dto.request.survey;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitAnswerRequest {

    @NotNull
    private Long questionId;

    private Integer ratingValue;
    private String selectedOption;
    private String textAnswer;
}
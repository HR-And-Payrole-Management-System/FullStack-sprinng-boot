package com.hrms.hr_payroll_management_system.dto.request.survey;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateSurveyRequest {

    @NotBlank
    private String title;

    private String description;
    private Long departmentId;
    private boolean anonymous = true;
    private LocalDate closesAt;

    @NotEmpty(message = "A survey needs at least one question")
    @Valid
    private List<SurveyQuestionRequest> questions;
}
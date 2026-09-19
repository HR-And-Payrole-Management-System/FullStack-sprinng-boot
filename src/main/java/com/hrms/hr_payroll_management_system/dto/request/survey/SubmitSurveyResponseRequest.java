package com.hrms.hr_payroll_management_system.dto.request.survey;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SubmitSurveyResponseRequest {

    @NotNull
    private Long employeeId;

    @NotEmpty
    @Valid
    private List<SubmitAnswerRequest> answers;
}
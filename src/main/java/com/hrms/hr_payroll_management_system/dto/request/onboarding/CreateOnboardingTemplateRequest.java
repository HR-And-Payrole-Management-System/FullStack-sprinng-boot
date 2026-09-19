package com.hrms.hr_payroll_management_system.dto.request.onboarding;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOnboardingTemplateRequest {

    @NotBlank
    private String name;

    private String description;

    private Long departmentId; // nullable = applies to any department

    @NotEmpty(message = "A template needs at least one task")
    @Valid
    private List<OnboardingTemplateTaskRequest> tasks;
}
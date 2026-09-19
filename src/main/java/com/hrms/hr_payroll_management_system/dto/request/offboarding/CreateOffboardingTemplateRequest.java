package com.hrms.hr_payroll_management_system.dto.request.offboarding;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOffboardingTemplateRequest {

    @NotBlank
    private String name;

    private String description;

    @NotEmpty(message = "A template needs at least one task")
    @Valid
    private List<OffboardingTemplateTaskRequest> tasks;
}
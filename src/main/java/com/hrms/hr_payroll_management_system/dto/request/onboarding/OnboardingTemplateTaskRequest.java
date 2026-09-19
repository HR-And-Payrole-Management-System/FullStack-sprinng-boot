package com.hrms.hr_payroll_management_system.dto.request.onboarding;

import com.hrms.hr_payroll_management_system.enums.OnboardingTaskRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OnboardingTemplateTaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private OnboardingTaskRole assignedRole;

    private int dueOffsetDays;

    private boolean mandatory = true;

    private int sequenceOrder;
}
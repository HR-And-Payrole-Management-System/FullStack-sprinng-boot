package com.hrms.hr_payroll_management_system.dto.request.onboarding;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartOnboardingRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Template ID is required")
    private Long templateId;
}
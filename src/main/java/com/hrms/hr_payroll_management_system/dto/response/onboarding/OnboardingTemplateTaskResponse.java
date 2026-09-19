package com.hrms.hr_payroll_management_system.dto.response.onboarding;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingTemplateTaskResponse {
    private Long id;
    private String title;
    private String description;
    private String assignedRole;
    private int dueOffsetDays;
    private boolean mandatory;
    private int sequenceOrder;
}
package com.hrms.hr_payroll_management_system.dto.response.onboarding;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingTaskResponse {
    private Long id;
    private String title;
    private String description;
    private String assignedRole;
    private LocalDate dueDate;
    private boolean mandatory;
    private String status;
    private boolean overdue;
}
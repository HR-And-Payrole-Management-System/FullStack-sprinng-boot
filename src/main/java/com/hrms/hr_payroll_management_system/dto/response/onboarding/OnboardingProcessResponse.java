package com.hrms.hr_payroll_management_system.dto.response.onboarding;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingProcessResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String templateName;
    private LocalDate startDate;
    private String status;
    private int progressPercent;
    private List<OnboardingTaskResponse> tasks;
}
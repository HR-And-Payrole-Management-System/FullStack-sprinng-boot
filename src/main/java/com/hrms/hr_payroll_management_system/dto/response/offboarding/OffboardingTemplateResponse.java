package com.hrms.hr_payroll_management_system.dto.response.offboarding;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OffboardingTemplateResponse {
    private Long id;
    private String name;
    private String description;
    private String status;
    private List<OffboardingTemplateTaskResponse> tasks;
}
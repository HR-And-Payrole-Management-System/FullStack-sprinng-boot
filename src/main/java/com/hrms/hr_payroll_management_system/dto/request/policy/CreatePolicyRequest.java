package com.hrms.hr_payroll_management_system.dto.request.policy;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePolicyRequest {

    @NotBlank
    private String title;

    private String category;

    private Long departmentId;

    private boolean requiresAcknowledgment = true;
}
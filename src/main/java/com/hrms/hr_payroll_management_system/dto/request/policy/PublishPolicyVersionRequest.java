package com.hrms.hr_payroll_management_system.dto.request.policy;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PublishPolicyVersionRequest {

    @NotBlank(message = "Policy content cannot be empty")
    private String content;

    private Long publishedByEmployeeId;
}
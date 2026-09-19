package com.hrms.hr_payroll_management_system.dto.request.billing;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePlanRequest {

    @NotBlank(message = "Plan key is required.")
    private String planKey; // FREE, STARTER, PROFESSIONAL, ENTERPRISE
}
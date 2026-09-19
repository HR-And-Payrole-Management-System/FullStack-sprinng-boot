package com.hrms.hr_payroll_management_system.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResendOtpRequest {

    @NotBlank(message = "Pre-auth token is required")
    private String preAuthToken;
}
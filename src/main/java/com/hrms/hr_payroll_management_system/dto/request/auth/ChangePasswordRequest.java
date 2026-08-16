package com.hrms.hr_payroll_management_system.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 100)
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
package com.hrms.hr_payroll_management_system.dto.request.role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import jakarta.validation.constraints.Pattern;

@Data
public class UpdateRoleRequest {

    @NotBlank(message = "Role name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 255)
    private String description;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Color must be a hex value like #7C3AED")
    private String badgeColor;

}
package com.hrms.hr_payroll_management_system.dto.request.role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateRoleRequest {

    @NotBlank(message = "Role name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 255)
    private String description;

}
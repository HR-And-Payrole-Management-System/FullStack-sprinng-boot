package com.hrms.hr_payroll_management_system.dto.request.jobrole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateJobRoleRequest {

    @NotBlank(message = "Job role name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @Size(max = 1000)
    private String responsibilities;

    private String level;

    private Long departmentId;
}
package com.hrms.hr_payroll_management_system.dto.request.position;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatePositionRequest {

    @NotBlank(message = "Position name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 255)
    private String description;
}
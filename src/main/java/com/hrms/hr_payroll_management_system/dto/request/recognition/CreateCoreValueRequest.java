package com.hrms.hr_payroll_management_system.dto.request.recognition;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCoreValueRequest {

    @NotBlank
    private String name;

    private String description;

    private String icon;
}
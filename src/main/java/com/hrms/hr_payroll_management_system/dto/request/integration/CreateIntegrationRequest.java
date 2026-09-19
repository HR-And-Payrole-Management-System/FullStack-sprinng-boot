package com.hrms.hr_payroll_management_system.dto.request.integration;

import com.hrms.hr_payroll_management_system.enums.IntegrationCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateIntegrationRequest {

    @NotBlank(message = "Provider key is required.")
    private String providerKey;

    @NotBlank(message = "Display name is required.")
    private String displayName;

    private String description;

    @NotNull(message = "Category is required.")
    private IntegrationCategory category;

    private String iconKey;
}
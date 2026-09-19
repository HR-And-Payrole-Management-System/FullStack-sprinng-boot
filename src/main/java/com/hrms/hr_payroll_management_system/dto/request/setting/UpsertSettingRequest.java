package com.hrms.hr_payroll_management_system.dto.request.setting;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpsertSettingRequest {

    @NotBlank(message = "Setting key is required.")
    private String settingKey;

    private String settingValue;

    @NotBlank(message = "Category is required.")
    private String category;

    @NotBlank(message = "Data type is required.")
    private String dataType;

    private String description;
}
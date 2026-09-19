package com.hrms.hr_payroll_management_system.dto.request.recruitment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateApplicationStageRequest {

    @NotBlank(message = "Stage is required")
    private String stage;

    @Size(max = 1000)
    private String notes;
}
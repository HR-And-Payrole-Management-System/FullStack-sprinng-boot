package com.hrms.hr_payroll_management_system.dto.request.okr;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateObjectiveRequest {

    @NotNull
    private Long cycleId;

    @NotNull
    private Long ownerId;

    @NotBlank
    private String title;

    private String description;

    private Long parentObjectiveId; // null = top-level
}
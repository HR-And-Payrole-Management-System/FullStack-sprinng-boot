package com.hrms.hr_payroll_management_system.dto.request.succession;

import com.hrms.hr_payroll_management_system.enums.PositionCriticality;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateKeyPositionRequest {

    @NotNull
    private Long positionId;

    private Long currentHolderId; // nullable

    @NotNull
    private PositionCriticality criticality;

    private String notes;
}
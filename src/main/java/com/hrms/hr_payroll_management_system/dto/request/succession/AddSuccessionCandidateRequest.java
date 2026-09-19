package com.hrms.hr_payroll_management_system.dto.request.succession;

import com.hrms.hr_payroll_management_system.enums.PotentialRating;
import com.hrms.hr_payroll_management_system.enums.ReadinessLevel;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddSuccessionCandidateRequest {

    @NotNull
    private Long employeeId;

    @NotNull
    private PotentialRating potentialRating;

    @NotNull
    private ReadinessLevel readiness;

    private String developmentNotes;
}
package com.hrms.hr_payroll_management_system.dto.request.compliance;

import com.hrms.hr_payroll_management_system.enums.ComplianceRequirementType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateComplianceRequirementRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private ComplianceRequirementType type;

    private Long documentTypeId;   // required when type == DOCUMENT
    private Long trainingProgramId; // required when type == TRAINING
    private Long departmentId;     // null = company-wide
}
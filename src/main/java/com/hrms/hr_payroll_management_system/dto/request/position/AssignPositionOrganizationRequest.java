package com.hrms.hr_payroll_management_system.dto.request.position;

import com.hrms.hr_payroll_management_system.enums.PositionLevel;

import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Data
public class AssignPositionOrganizationRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Position level is required")
    private PositionLevel level;
}
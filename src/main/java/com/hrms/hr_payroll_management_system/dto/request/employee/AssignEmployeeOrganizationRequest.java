package com.hrms.hr_payroll_management_system.dto.request.employee;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignEmployeeOrganizationRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Position ID is required")
    private Long positionId;

    private Long managerId;
}
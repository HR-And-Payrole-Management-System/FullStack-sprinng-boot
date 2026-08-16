package com.hrms.hr_payroll_management_system.dto.request.department;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignDepartmentOrganizationRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;
}
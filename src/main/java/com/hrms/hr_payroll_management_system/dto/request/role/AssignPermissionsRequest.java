package com.hrms.hr_payroll_management_system.dto.request.role;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class AssignPermissionsRequest {

    @NotEmpty(message = "Permission IDs are required")
    private Set<Long> permissionIds;

}
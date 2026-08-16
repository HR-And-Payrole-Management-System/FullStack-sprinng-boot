package com.hrms.hr_payroll_management_system.dto.request.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class AssignRolesRequest {

    @NotEmpty(message = "Role IDs are required")
    private Set<Long> roleIds;
}
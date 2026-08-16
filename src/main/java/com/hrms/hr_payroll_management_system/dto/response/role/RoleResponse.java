package com.hrms.hr_payroll_management_system.dto.response.role;

import java.util.Set;

import com.hrms.hr_payroll_management_system.dto.response.permission.PermissionResponse;

import lombok.Data;

@Data
public class RoleResponse {

    private Long id;

    private String name;

    private String description;

    private String status;
    private Set<PermissionResponse> permissions;

}
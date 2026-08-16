package com.hrms.hr_payroll_management_system.dto.response.permission;

import lombok.Data;

@Data
public class PermissionResponse {

    private Long id;

    private String name;

    private String description;

    private String status;

}
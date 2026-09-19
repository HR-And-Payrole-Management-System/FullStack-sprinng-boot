package com.hrms.hr_payroll_management_system.dto.response.jobrole;

import lombok.Data;

@Data
public class JobRoleResponse {

    private Long id;

    private String name;

    private String description;

    private String responsibilities;

    private String level;

    private Long departmentId;

    private String departmentName;

    private String status;
}
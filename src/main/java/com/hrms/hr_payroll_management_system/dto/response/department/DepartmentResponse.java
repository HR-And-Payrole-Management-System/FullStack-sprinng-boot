package com.hrms.hr_payroll_management_system.dto.response.department;

import lombok.Data;

@Data
public class DepartmentResponse {

    private Long id;

    private String name;

    private String description;

    private String status;

    private Long companyId;

    private String companyName;

    private Long branchId;

    private String branchName;
}
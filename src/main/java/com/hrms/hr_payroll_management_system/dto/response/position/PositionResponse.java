package com.hrms.hr_payroll_management_system.dto.response.position;

import lombok.Data;

@Data
public class PositionResponse {

    private Long id;

    private String name;

    private String description;

    private String status;

    private Long companyId;
    
    private String companyName;

    private Long branchId;
    private String branchName;

    private Long departmentId;
    private String departmentName;

    private String level;
    }
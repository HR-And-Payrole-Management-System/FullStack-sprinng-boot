package com.hrms.hr_payroll_management_system.dto.response.branch;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BranchResponse {

    private Long id;

    private String code;

    private String name;

    private String email;

    private String phone;

    private String address;

    private Boolean headOffice;

    private String status;

    private Long companyId;

    private String companyName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
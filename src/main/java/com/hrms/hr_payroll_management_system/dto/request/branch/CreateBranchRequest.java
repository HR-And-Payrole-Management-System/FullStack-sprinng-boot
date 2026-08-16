package com.hrms.hr_payroll_management_system.dto.request.branch;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class CreateBranchRequest {

    @NotBlank(message = "Branch code is required")
    @Size(max = 50)
    private String code;

    @NotBlank(message = "Branch name is required")
    @Size(max = 150)
    private String name;

    @Email(message = "Branch email is invalid")
    @Size(max = 255)
    private String email;

    @Size(max = 20)
    private String phone;

    @Size(max = 255)
    private String address;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    private Boolean headOffice = false;
}
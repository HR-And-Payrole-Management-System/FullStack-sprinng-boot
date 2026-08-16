package com.hrms.hr_payroll_management_system.dto.request.company;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class UpdateCompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150)
    private String name;

    @NotBlank(message = "Company email is required")
    @Email(message = "Company email is invalid")
    @Size(max = 255)
    private String email;

    @Size(max = 20)
    private String phone;

    @Size(max = 255)
    private String address;

    @Size(max = 100)
    private String taxNumber;

    @Size(max = 100)
    private String registrationNumber;

    @Size(max = 255)
    private String website;
}
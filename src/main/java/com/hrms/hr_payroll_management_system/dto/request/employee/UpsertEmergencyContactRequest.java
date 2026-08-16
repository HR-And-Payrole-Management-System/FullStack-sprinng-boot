package com.hrms.hr_payroll_management_system.dto.request.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class UpsertEmergencyContactRequest {

    @NotBlank(message = "Contact name is required")
    @Size(max = 150)
    private String contactName;

    @NotBlank(message = "Relationship is required")
    @Size(max = 50)
    private String relationship;

    @NotBlank(message = "Phone is required")
    @Size(max = 20)
    private String phone;

    @Email(message = "Email is invalid")
    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String address;
}
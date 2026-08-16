package com.hrms.hr_payroll_management_system.dto.request.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEmployeeRequest {

    @NotBlank(message = "Employee code is required")
    @Size(max = 50)
    private String employeeCode;

    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;

    @Size(max = 20)
    private String phone;

    private LocalDate dateOfBirth;

    @Size(max = 20)
    private String gender;

    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;

    @Size(max = 255)
    private String address;
}
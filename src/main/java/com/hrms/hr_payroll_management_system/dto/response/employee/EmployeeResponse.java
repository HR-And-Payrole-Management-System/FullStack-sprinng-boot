package com.hrms.hr_payroll_management_system.dto.response.employee;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EmployeeResponse {

    private Long id;

    private String employeeCode;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    private String gender;

    private LocalDate hireDate;

    private String address;

    private String photoUrl;

    // Employment
    private String employmentType;

    private LocalDate probationEndDate;

    private LocalDate contractStartDate;

    private LocalDate contractEndDate;

    // Organization

    private Long companyId;
    private String companyName;

    private Long branchId;
    private String branchName;
    private Long departmentId;

    private String departmentName;

    private Long positionId;

    private String positionName;

    private Long managerId;

    private String managerName;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
}
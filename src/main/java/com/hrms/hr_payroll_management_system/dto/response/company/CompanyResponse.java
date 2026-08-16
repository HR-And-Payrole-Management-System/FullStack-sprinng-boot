package com.hrms.hr_payroll_management_system.dto.response.company;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanyResponse {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String address;

    private String taxNumber;

    private String registrationNumber;

    private String website;

    private String logoUrl;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
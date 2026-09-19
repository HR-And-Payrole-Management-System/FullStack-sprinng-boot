package com.hrms.hr_payroll_management_system.dto.response.idcard;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class IdCardResponse {

    private Long id;

    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String photoUrl;

    private String companyName;
    private String branchName;
    private String departmentName;
    private String positionName;

    private String roleName;
    private String roleColor;

    private String cardNumber;
    private String status;
    private String accessLevel;

    private LocalDate issuedDate;
    private String note;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
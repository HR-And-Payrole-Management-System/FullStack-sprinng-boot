package com.hrms.hr_payroll_management_system.dto.response.document;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EmployeeDocumentResponse {

    private Long id;

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private Long documentTypeId;
    private String documentTypeName;

    private String documentNumber;

    private String fileName;
    private String fileUrl;

    private LocalDate issueDate;
    private LocalDate expiryDate;

    private String status;

    private String verificationNote;
}
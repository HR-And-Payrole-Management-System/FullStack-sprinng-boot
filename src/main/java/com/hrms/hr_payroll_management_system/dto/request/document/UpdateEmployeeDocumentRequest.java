package com.hrms.hr_payroll_management_system.dto.request.document;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateEmployeeDocumentRequest {

    @Size(max = 100)
    private String documentNumber;

    @Size(max = 255)
    private String fileName;

    @Size(max = 1000)
    private String fileUrl;

    private LocalDate issueDate;

    private LocalDate expiryDate;
}
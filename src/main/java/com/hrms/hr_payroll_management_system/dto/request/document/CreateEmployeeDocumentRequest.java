package com.hrms.hr_payroll_management_system.dto.request.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEmployeeDocumentRequest {

    @NotNull
    private Long documentTypeId;

    @Size(max = 100)
    private String documentNumber;

    @NotBlank
    @Size(max = 255)
    private String fileName;

    @NotBlank
    @Size(max = 1000)
    private String fileUrl;

    private LocalDate issueDate;

    private LocalDate expiryDate;
}
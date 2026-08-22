package com.hrms.hr_payroll_management_system.dto.request.document;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VerifyDocumentRequest {

    @NotNull
    private Boolean approved;

    @Size(max = 1000)
    private String note;
}
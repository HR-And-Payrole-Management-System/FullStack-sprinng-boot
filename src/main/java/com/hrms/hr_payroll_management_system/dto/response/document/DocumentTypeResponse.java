package com.hrms.hr_payroll_management_system.dto.response.document;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentTypeResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean requiresExpiry;
    private Boolean active;
}
package com.hrms.hr_payroll_management_system.dto.response.integration;

import com.hrms.hr_payroll_management_system.enums.IntegrationCategory;
import com.hrms.hr_payroll_management_system.enums.IntegrationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IntegrationResponse {
    private Long id;
    private String providerKey;
    private String displayName;
    private String description;
    private IntegrationCategory category;
    private String iconKey;
    private IntegrationStatus status;
    private String webhookUrl;
    private Boolean hasApiKey; // never return the raw key
    private LocalDateTime connectedAt;
    private String connectedBy;
    private Boolean isSystem;
}
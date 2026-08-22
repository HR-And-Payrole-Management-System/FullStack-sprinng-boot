package com.hrms.hr_payroll_management_system.dto.response.audit;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponse {

    private Long id;

    private String actor;

    private String action;

    private String entityType;

    private Long entityId;

    private String description;

    private String ipAddress;

    private LocalDateTime createdAt;
}
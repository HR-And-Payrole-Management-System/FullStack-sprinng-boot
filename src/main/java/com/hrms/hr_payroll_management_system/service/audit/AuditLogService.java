package com.hrms.hr_payroll_management_system.service.audit;

import com.hrms.hr_payroll_management_system.dto.response.audit.AuditLogResponse;
import com.hrms.hr_payroll_management_system.enums.AuditAction;

import java.util.List;

public interface AuditLogService {

    void log(
            AuditAction action,
            String entityType,
            Long entityId,
            String description
    );

    List<AuditLogResponse> getAll();

    List<AuditLogResponse> getByActor(
            String actor
    );

    List<AuditLogResponse> getByEntity(
            String entityType,
            Long entityId
    );
}
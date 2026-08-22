package com.hrms.hr_payroll_management_system.repository.audit;

import com.hrms.hr_payroll_management_system.entity.audit.AuditLog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog>
    findByActorOrderByCreatedAtDesc(
            String actor
    );

    List<AuditLog>
    findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
            String entityType,
            Long entityId
    );

    List<AuditLog>
    findAllByOrderByCreatedAtDesc();
}
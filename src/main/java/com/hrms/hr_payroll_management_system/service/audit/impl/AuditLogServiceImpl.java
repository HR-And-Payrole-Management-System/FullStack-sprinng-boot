package com.hrms.hr_payroll_management_system.service.audit.impl;

import com.hrms.hr_payroll_management_system.dto.response.audit.AuditLogResponse;
import com.hrms.hr_payroll_management_system.entity.audit.AuditLog;
import com.hrms.hr_payroll_management_system.enums.AuditAction;
import com.hrms.hr_payroll_management_system.repository.audit.AuditLogRepository;
import com.hrms.hr_payroll_management_system.service.audit.AuditLogService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditLogServiceImpl
        implements AuditLogService {

    private final AuditLogRepository repository;

    private final HttpServletRequest request;

    @Override
    public void log(
            AuditAction action,
            String entityType,
            Long entityId,
            String description
    ) {

        String actor =
                getCurrentActor();

        AuditLog log =
                AuditLog.builder()
                        .actor(actor)
                        .action(action)
                        .entityType(entityType)
                        .entityId(entityId)
                        .description(description)
                        .ipAddress(
                                getClientIp()
                        )
                        .build();

        repository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAll() {

        return repository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getByActor(
            String actor
    ) {

        return repository
                .findByActorOrderByCreatedAtDesc(
                        actor
                )
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getByEntity(
            String entityType,
            Long entityId
    ) {

        return repository
                .findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
                        entityType,
                        entityId
                )
                .stream()
                .map(this::map)
                .toList();
    }

    private String getCurrentActor() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return "SYSTEM";
        }

        String name =
                authentication.getName();

        if (name == null
                || name.equals(
                        "anonymousUser"
                )) {

            return "SYSTEM";
        }

        return name;
    }

    private String getClientIp() {

        String forwarded =
                request.getHeader(
                        "X-Forwarded-For"
                );

        if (forwarded != null
                && !forwarded.isBlank()) {

            return forwarded
                    .split(",")[0]
                    .trim();
        }

        return request.getRemoteAddr();
    }

    private AuditLogResponse map(
            AuditLog log
    ) {

        return AuditLogResponse.builder()
                .id(log.getId())
                .actor(log.getActor())
                .action(
                        log.getAction().name()
                )
                .entityType(
                        log.getEntityType()
                )
                .entityId(
                        log.getEntityId()
                )
                .description(
                        log.getDescription()
                )
                .ipAddress(
                        log.getIpAddress()
                )
                .createdAt(
                        log.getCreatedAt()
                )
                .build();
    }
}
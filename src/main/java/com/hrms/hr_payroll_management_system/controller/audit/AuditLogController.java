package com.hrms.hr_payroll_management_system.controller.audit;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.response.audit.AuditLogResponse;
import com.hrms.hr_payroll_management_system.service.audit.AuditLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService service;

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('AUDIT_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<AuditLogResponse>>
            > getAll() {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<AuditLogResponse>>builder()
                        .success(true)
                        .message(
                                "Audit logs retrieved successfully."
                        )
                        .data(service.getAll())
                        .build()
        );
    }

    @GetMapping("/actor")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('AUDIT_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<AuditLogResponse>>
            > byActor(
            @RequestParam String actor
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<AuditLogResponse>>builder()
                        .success(true)
                        .message(
                                "Audit logs retrieved successfully."
                        )
                        .data(
                                service.getByActor(actor)
                        )
                        .build()
        );
    }

    @GetMapping(
            "/entity/{entityType}/{entityId}"
    )
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('AUDIT_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<AuditLogResponse>>
            > byEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<AuditLogResponse>>builder()
                        .success(true)
                        .message(
                                "Audit logs retrieved successfully."
                        )
                        .data(
                                service.getByEntity(
                                        entityType,
                                        entityId
                                )
                        )
                        .build()
        );
    }
}
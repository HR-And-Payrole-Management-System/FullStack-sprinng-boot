package com.hrms.hr_payroll_management_system.entity.audit;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.AuditAction;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(
        name = "audit_logs",
        indexes = {
                @Index(
                        name = "idx_audit_actor",
                        columnList = "actor"
                ),
                @Index(
                        name = "idx_audit_entity",
                        columnList = "entity_type,entity_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 255
    )
    private String actor;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 50
    )
    private AuditAction action;

    @Column(
            name = "entity_type",
            nullable = false,
            length = 100
    )
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(
            length = 2000
    )
    private String description;

    @Column(
            name = "ip_address",
            length = 100
    )
    private String ipAddress;
}
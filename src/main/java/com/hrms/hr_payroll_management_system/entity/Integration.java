package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.IntegrationCategory;
import com.hrms.hr_payroll_management_system.enums.IntegrationStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "integrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Integration extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_key", nullable = false, unique = true, length = 50)
    private String providerKey; // e.g. "SLACK", "ZOOM", "GITHUB"

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private IntegrationCategory category;

    @Column(name = "icon_key", length = 50)
    private String iconKey; // maps to a lucide-react icon name on the frontend

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private IntegrationStatus status = IntegrationStatus.DISCONNECTED;

    @Column(name = "api_key")
    private String apiKey;

    @Column(name = "webhook_url", length = 500)
    private String webhookUrl;

    @Column(name = "connected_at")
    private java.time.LocalDateTime connectedAt;

    @Column(name = "connected_by", length = 150)
    private String connectedBy;

    @Column(name = "is_system", nullable = false)
    @Builder.Default
    private Boolean isSystem = true; // seeded catalog entries can't be deleted
}
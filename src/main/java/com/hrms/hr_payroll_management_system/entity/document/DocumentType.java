package com.hrms.hr_payroll_management_system.entity.document;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "document_types",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_document_type_name",
                        columnNames = "name"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(
            name = "requires_expiry",
            nullable = false
    )
    @Builder.Default
    private Boolean requiresExpiry = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
package com.hrms.hr_payroll_management_system.entity.notification;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.NotificationType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "notifications",
        indexes = {
                @Index(
                        name = "idx_notification_employee",
                        columnList = "employee_id"
                ),
                @Index(
                        name = "idx_notification_read",
                        columnList = "is_read"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "employee_id",
            nullable = false
    )
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 50
    )
    private NotificationType type;

    @Column(
            nullable = false,
            length = 200
    )
    private String title;

    @Column(
            nullable = false,
            length = 2000
    )
    private String message;

    @Column(
            name = "is_read",
            nullable = false
    )
    @Builder.Default
    private Boolean read = false;

    @Column(
            name = "reference_type",
            length = 100
    )
    private String referenceType;

    @Column(name = "reference_id")
    private Long referenceId;
}
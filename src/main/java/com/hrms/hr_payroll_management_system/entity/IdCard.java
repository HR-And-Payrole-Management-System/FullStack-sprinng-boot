package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.IdCardAccessLevel;
import com.hrms.hr_payroll_management_system.enums.IdCardStatus;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "id_cards",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_idcard_employee",
                        columnNames = "employee_id"
                )
        },
        indexes = {
                @Index(
                        name = "idx_idcard_status",
                        columnList = "status"
                ),
                @Index(
                        name = "idx_idcard_access_level",
                        columnList = "access_level"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdCard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "employee_id",
            nullable = false,
            unique = true
    )
    private Employee employee;

    @Column(
            name = "card_number",
            length = 50
    )
    private String cardNumber;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    @Builder.Default
    private IdCardStatus status = IdCardStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "access_level",
            nullable = false,
            length = 30
    )
    @Builder.Default
    private IdCardAccessLevel accessLevel = IdCardAccessLevel.EMPLOYEE_ACCESS;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @Column(length = 500)
    private String note;
}
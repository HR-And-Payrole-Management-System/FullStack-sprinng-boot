package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.HolidayType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "holidays",
        indexes = {
                @Index(
                        name = "idx_holiday_date",
                        columnList = "holiday_date"
                ),
                @Index(
                        name = "idx_holiday_branch",
                        columnList = "branch_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Holiday extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(
            name = "holiday_date",
            nullable = false
    )
    private LocalDate holidayDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private HolidayType type;

    /*
     * null company + null branch
     * = public/global holiday
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    /*
     * null branch means the holiday is not
     * limited to one branch.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(length = 500)
    private String description;

    @Column(
            name = "paid_holiday",
            nullable = false
    )
    @Builder.Default
    private Boolean paidHoliday = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
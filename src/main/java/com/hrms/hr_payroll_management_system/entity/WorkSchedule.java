
package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.Status;

import jakarta.persistence.*;

import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "work_schedules",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_work_schedule_name",
                        columnNames = "name"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkSchedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 100
    )
    private String name;

    @Column(
            name = "start_time",
            nullable = false
    )
    private LocalTime startTime;

    @Column(
            name = "end_time",
            nullable = false
    )
    private LocalTime endTime;

    @Column(
            name = "break_minutes",
            nullable = false
    )
    @Builder.Default
    private Integer breakMinutes = 60;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "work_schedule_days",
            joinColumns = @JoinColumn(
                    name = "work_schedule_id"
            )
    )
    @Enumerated(EnumType.STRING)
    @Column(
            name = "day_of_week",
            nullable = false,
            length = 20
    )
    @Builder.Default
    private Set<DayOfWeek> workingDays =
            new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    @Builder.Default
    private Status status = Status.ACTIVE;
}
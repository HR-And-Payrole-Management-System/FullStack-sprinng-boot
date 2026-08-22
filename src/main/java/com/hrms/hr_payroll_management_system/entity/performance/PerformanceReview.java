package com.hrms.hr_payroll_management_system.entity.performance;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.PerformanceReviewStatus;

import jakarta.persistence.*;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "performance_reviews",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_performance_review_employee_cycle",
                        columnNames = {
                                "employee_id",
                                "cycle_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceReview extends BaseEntity {

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

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "cycle_id",
            nullable = false
    )
    private PerformanceCycle cycle;

    @Column(
            name = "self_rating",
            precision = 3,
            scale = 2
    )
    private BigDecimal selfRating;

    @Column(
            name = "self_comment",
            length = 2000
    )
    private String selfComment;

    @Column(
            name = "manager_rating",
            precision = 3,
            scale = 2
    )
    private BigDecimal managerRating;

    @Column(
            name = "manager_comment",
            length = 2000
    )
    private String managerComment;

    @Column(
            name = "goal_score",
            precision = 5,
            scale = 2
    )
    private BigDecimal goalScore;

    @Column(
            name = "final_score",
            precision = 5,
            scale = 2
    )
    private BigDecimal finalScore;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    @Builder.Default
    private PerformanceReviewStatus status =
            PerformanceReviewStatus.PENDING;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "announcements",
        indexes = {
                @Index(name = "idx_announcement_active", columnList = "active"),
                @Index(name = "idx_announcement_posted_date", columnList = "posted_date")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String body;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    /*
     * null company + null branch = organization-wide announcement,
     * same convention as Holiday.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "posted_by_user_id", nullable = false)
    private User postedBy;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
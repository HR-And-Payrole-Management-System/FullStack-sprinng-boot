package com.hrms.hr_payroll_management_system.entity.recognition;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recognitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recognition extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giver_id", nullable = false)
    private Employee giver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Employee receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "core_value_id")
    private CoreValue coreValue; // optional tag

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private int points;

    @OneToMany(mappedBy = "recognition", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RecognitionLike> likes = new ArrayList<>();
}
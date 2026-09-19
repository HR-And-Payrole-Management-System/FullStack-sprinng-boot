package com.hrms.hr_payroll_management_system.entity.succession;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.Position;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import com.hrms.hr_payroll_management_system.enums.PositionCriticality;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "key_positions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeyPosition extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_holder_id")
    private Employee currentHolder; // nullable — a key position can be currently vacant

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PositionCriticality criticality;

    @Column(length = 500)
    private String notes;

    @OneToMany(mappedBy = "keyPosition", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SuccessionCandidate> candidates = new ArrayList<>();
}
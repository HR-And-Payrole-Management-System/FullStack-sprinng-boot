package com.hrms.hr_payroll_management_system.entity.recognition;

import com.hrms.hr_payroll_management_system.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recognition_likes", uniqueConstraints = @UniqueConstraint(columnNames = {"recognition_id", "employee_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecognitionLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recognition_id", nullable = false)
    private Recognition recognition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}
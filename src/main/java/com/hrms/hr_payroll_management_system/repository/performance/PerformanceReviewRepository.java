package com.hrms.hr_payroll_management_system.repository.performance;

import com.hrms.hr_payroll_management_system.entity.performance.PerformanceReview;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PerformanceReviewRepository
        extends JpaRepository<PerformanceReview, Long> {

    Optional<PerformanceReview>
    findByEmployeeIdAndCycleId(
            Long employeeId,
            Long cycleId
    );

    List<PerformanceReview>
    findByEmployeeIdOrderByIdDesc(
            Long employeeId
    );
}
package com.hrms.hr_payroll_management_system.repository.performance;

import com.hrms.hr_payroll_management_system.entity.performance.PerformanceGoal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceGoalRepository
        extends JpaRepository<PerformanceGoal, Long> {

    List<PerformanceGoal>
    findByEmployeeIdAndCycleId(
            Long employeeId,
            Long cycleId
    );
}
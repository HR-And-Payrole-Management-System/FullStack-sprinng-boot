package com.hrms.hr_payroll_management_system.repository.performance;

import com.hrms.hr_payroll_management_system.entity.performance.PerformanceCycle;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PerformanceCycleRepository
        extends JpaRepository<PerformanceCycle, Long> {

    boolean existsByName(String name);
}
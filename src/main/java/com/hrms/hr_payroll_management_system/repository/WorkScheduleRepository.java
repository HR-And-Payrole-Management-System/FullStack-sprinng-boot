package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.WorkSchedule;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkScheduleRepository
        extends JpaRepository<WorkSchedule, Long> {

    boolean existsByName(String name);
}
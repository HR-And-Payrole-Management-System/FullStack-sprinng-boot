package com.hrms.hr_payroll_management_system.repository.training;

import com.hrms.hr_payroll_management_system.entity.training.TrainingProgram;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingProgramRepository
        extends JpaRepository<TrainingProgram, Long> {

    boolean existsByTitle(String title);
}
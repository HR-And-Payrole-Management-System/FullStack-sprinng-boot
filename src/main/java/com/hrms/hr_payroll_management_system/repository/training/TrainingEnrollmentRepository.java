package com.hrms.hr_payroll_management_system.repository.training;

import com.hrms.hr_payroll_management_system.entity.training.TrainingEnrollment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingEnrollmentRepository
        extends JpaRepository<TrainingEnrollment, Long> {

    List<TrainingEnrollment> findByEmployeeId(Long employeeId);

    List<TrainingEnrollment> findByTrainingProgramId(Long trainingProgramId);

    boolean existsByEmployeeIdAndTrainingProgramId(
            Long employeeId,
            Long trainingProgramId
    );

    boolean existsByTrainingProgramId(Long trainingProgramId);

    boolean existsByEmployeeId(Long employeeId);

    long countByStatus(com.hrms.hr_payroll_management_system.enums.TrainingEnrollmentStatus status);

        long count();
        
}
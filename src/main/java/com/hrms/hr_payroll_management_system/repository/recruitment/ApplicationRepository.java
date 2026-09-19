package com.hrms.hr_payroll_management_system.repository.recruitment;

import com.hrms.hr_payroll_management_system.entity.recruitment.Application;
import com.hrms.hr_payroll_management_system.enums.ApplicationStage;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByJobPostingId(Long jobPostingId);

    List<Application> findByCandidateId(Long candidateId);

    boolean existsByCandidateIdAndJobPostingId(
            Long candidateId,
            Long jobPostingId
    );

    boolean existsByJobPostingId(Long jobPostingId);

    boolean existsByCandidateId(Long candidateId);

    long countByJobPostingIdAndStage(
            Long jobPostingId,
            ApplicationStage stage
    );
    long countByStage(ApplicationStage stage);
}
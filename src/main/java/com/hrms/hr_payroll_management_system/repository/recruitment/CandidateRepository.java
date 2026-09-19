package com.hrms.hr_payroll_management_system.repository.recruitment;

import com.hrms.hr_payroll_management_system.entity.recruitment.Candidate;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository
        extends JpaRepository<Candidate, Long> {

    boolean existsByEmail(String email);
}
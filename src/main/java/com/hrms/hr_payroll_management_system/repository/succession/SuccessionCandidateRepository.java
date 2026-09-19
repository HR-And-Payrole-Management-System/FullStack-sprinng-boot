package com.hrms.hr_payroll_management_system.repository.succession;

import com.hrms.hr_payroll_management_system.entity.succession.SuccessionCandidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuccessionCandidateRepository extends JpaRepository<SuccessionCandidate, Long> {
    List<SuccessionCandidate> findByKeyPositionId(Long keyPositionId);
}
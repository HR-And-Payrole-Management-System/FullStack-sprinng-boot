package com.hrms.hr_payroll_management_system.repository.recruitment;

import com.hrms.hr_payroll_management_system.entity.recruitment.JobPosting;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository
        extends JpaRepository<JobPosting, Long> {

    List<JobPosting> findByDepartmentId(Long departmentId);

    boolean existsByDepartmentId(Long departmentId);

    boolean existsByPositionId(Long positionId);
}
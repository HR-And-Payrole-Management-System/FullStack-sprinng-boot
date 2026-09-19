package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.JobRole;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRoleRepository
        extends JpaRepository<JobRole, Long> {

    boolean existsByName(String name);

    List<JobRole> findByDepartmentId(Long departmentId);

    boolean existsByDepartmentId(Long departmentId);
}
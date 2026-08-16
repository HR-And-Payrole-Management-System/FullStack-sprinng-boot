package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Department;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    boolean existsByNameAndBranchId(
            String name,
            Long branchId
    );

    List<Department> findByCompanyId(
            Long companyId
    );

    List<Department> findByBranchId(
            Long branchId
    );

    boolean existsByCompanyId(
            Long companyId
    );

    boolean existsByBranchId(
            Long branchId
    );
}
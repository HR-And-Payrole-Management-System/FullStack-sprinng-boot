package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Position;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionRepository
        extends JpaRepository<Position, Long> {

    // Keep for existing Position CRUD
    boolean existsByName(String name);

    // Phase 6 organization
    boolean existsByNameAndDepartmentId(
            String name,
            Long departmentId
    );

    List<Position> findByCompanyId(
            Long companyId
    );

    List<Position> findByBranchId(
            Long branchId
    );

    List<Position> findByDepartmentId(
            Long departmentId
    );

    boolean existsByCompanyId(
            Long companyId
    );

    boolean existsByBranchId(
            Long branchId
    );

    boolean existsByDepartmentId(
            Long departmentId
    );
}
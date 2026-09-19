package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Location;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository
        extends JpaRepository<Location, Long> {

    List<Location> findByBranchId(Long branchId);

    boolean existsByBranchId(Long branchId);

    boolean existsByBranchIdAndPrimaryTrue(Long branchId);

    boolean existsByBranchIdAndPrimaryTrueAndIdNot(
            Long branchId,
            Long id
    );
}
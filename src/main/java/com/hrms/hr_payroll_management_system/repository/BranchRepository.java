package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Branch;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BranchRepository
        extends JpaRepository<Branch, Long> {

    boolean existsByCode(String code);

    List<Branch> findByCompanyId(Long companyId);

    boolean existsByCompanyId(Long companyId);

    boolean existsByCompanyIdAndHeadOfficeTrue(Long companyId);

    boolean existsByCompanyIdAndHeadOfficeTrueAndIdNot(
            Long companyId,
            Long id
    );
}
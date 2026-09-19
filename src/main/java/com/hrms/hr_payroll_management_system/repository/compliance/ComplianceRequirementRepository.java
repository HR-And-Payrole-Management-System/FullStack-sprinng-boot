package com.hrms.hr_payroll_management_system.repository.compliance;

import com.hrms.hr_payroll_management_system.entity.compliance.ComplianceRequirement;
import com.hrms.hr_payroll_management_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplianceRequirementRepository extends JpaRepository<ComplianceRequirement, Long> {
    List<ComplianceRequirement> findByStatus(Status status);
}
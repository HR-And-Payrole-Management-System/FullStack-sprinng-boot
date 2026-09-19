package com.hrms.hr_payroll_management_system.repository.policy;

import com.hrms.hr_payroll_management_system.entity.policy.PolicyVersion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyVersionRepository extends JpaRepository<PolicyVersion, Long> {
}
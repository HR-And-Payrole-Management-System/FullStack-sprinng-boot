package com.hrms.hr_payroll_management_system.repository.policy;

import com.hrms.hr_payroll_management_system.entity.policy.Policy;
import com.hrms.hr_payroll_management_system.enums.PolicyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByStatus(PolicyStatus status);
}
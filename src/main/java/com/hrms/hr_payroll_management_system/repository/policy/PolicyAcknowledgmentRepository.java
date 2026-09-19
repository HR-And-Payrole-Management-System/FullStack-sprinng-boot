package com.hrms.hr_payroll_management_system.repository.policy;

import com.hrms.hr_payroll_management_system.entity.policy.PolicyAcknowledgment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PolicyAcknowledgmentRepository extends JpaRepository<PolicyAcknowledgment, Long> {
    List<PolicyAcknowledgment> findByPolicyVersionId(Long policyVersionId);
    Optional<PolicyAcknowledgment> findByPolicyVersionIdAndEmployeeId(Long policyVersionId, Long employeeId);
}
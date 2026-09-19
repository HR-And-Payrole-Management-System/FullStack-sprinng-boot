package com.hrms.hr_payroll_management_system.service.policy;

import com.hrms.hr_payroll_management_system.dto.request.policy.CreatePolicyRequest;
import com.hrms.hr_payroll_management_system.dto.request.policy.PublishPolicyVersionRequest;
import com.hrms.hr_payroll_management_system.dto.response.policy.PolicyResponse;

import java.util.List;

public interface PolicyService {
    PolicyResponse create(CreatePolicyRequest request);
    PolicyResponse publishNewVersion(Long policyId, PublishPolicyVersionRequest request);
    PolicyResponse acknowledge(Long policyId, Long employeeId);
    List<PolicyResponse> getAll();
    List<PolicyResponse> getPendingForEmployee(Long employeeId);
    PolicyResponse update(Long id, CreatePolicyRequest request);
    void archive(Long id);
    void delete(Long id);
}
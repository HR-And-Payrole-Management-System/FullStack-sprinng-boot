package com.hrms.hr_payroll_management_system.service.compliance;

import com.hrms.hr_payroll_management_system.dto.request.compliance.CreateComplianceRequirementRequest;
import com.hrms.hr_payroll_management_system.dto.response.compliance.ComplianceRequirementResponse;

import java.util.List;

public interface ComplianceService {
    ComplianceRequirementResponse create(CreateComplianceRequirementRequest request);
    List<ComplianceRequirementResponse> getAll();
    List<ComplianceRequirementResponse> getNonCompliantOnly();

    ComplianceRequirementResponse update(Long id, CreateComplianceRequirementRequest request);
    void delete(Long id);
}
package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.response.organization.OrganizationSummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.organization.OrganizationTreeResponse;

public interface OrganizationService {

    OrganizationSummaryResponse getSummary();

    OrganizationTreeResponse getOrganizationTree(
            Long companyId
    );
}
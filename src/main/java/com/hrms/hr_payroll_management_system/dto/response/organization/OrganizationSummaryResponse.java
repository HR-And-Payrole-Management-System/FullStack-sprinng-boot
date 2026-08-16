package com.hrms.hr_payroll_management_system.dto.response.organization;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrganizationSummaryResponse {

    private Long totalCompanies;

    private Long totalBranches;

    private Long totalDepartments;

    private Long totalPositions;

    private Long totalEmployees;
}
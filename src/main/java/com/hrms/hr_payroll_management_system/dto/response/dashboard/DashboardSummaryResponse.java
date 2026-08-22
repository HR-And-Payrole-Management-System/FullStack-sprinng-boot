package com.hrms.hr_payroll_management_system.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;

    private long totalCompanies;
    private long totalBranches;
    private long totalDepartments;
    private long totalPositions;
}
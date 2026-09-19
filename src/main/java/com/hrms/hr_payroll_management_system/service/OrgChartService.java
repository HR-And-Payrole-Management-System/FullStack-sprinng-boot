package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.response.orgchart.OrgChartNodeResponse;

import java.util.List;

public interface OrgChartService {

    /**
     * Full org chart for a company. Returns one root node per employee
     * with no manager (or whose manager is outside the company/inactive).
     */
    List<OrgChartNodeResponse> getCompanyOrgChart(Long companyId);

    /**
     * Sub-tree rooted at a single employee (e.g. "show me my team").
     */
    OrgChartNodeResponse getSubTree(Long employeeId);
}
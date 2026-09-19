package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.response.workforce.ChartPointResponse;

import java.util.List;

public interface WorkforceInsightsService {
    List<ChartPointResponse> getEmployeeTrend();
    List<ChartPointResponse> getAttritionByDepartment();
    List<ChartPointResponse> getAttritionByPosition();
    List<ChartPointResponse> getAgeGroups();
    List<ChartPointResponse> getGenderDiversity();
    List<ChartPointResponse> getTenureDistribution();
}
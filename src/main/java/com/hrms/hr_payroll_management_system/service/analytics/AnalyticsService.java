package com.hrms.hr_payroll_management_system.service.analytics;

import com.hrms.hr_payroll_management_system.dto.response.analytics.AnalyticsPointResponse;
import com.hrms.hr_payroll_management_system.dto.response.analytics.AttendanceTrendPointResponse;

import java.util.List;

public interface AnalyticsService {

    List<AnalyticsPointResponse> getPayrollCostTrend(int months);

    List<AnalyticsPointResponse> getPayrollCostByDepartment();

    List<AnalyticsPointResponse> getLeaveUtilizationByType();

    List<AnalyticsPointResponse> getLeaveUtilizationByDepartment();

    List<AttendanceTrendPointResponse> getAttendanceTrend(int days);

    List<AnalyticsPointResponse> getRecruitmentFunnel();
}
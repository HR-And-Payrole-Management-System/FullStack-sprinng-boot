package com.hrms.hr_payroll_management_system.service.dashboard;

import com.hrms.hr_payroll_management_system.dto.response.announcement.AnnouncementResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.AttendanceDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.ComplianceAlertResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.DashboardSummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.EmployeeDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.LeaveDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.OrganizationDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.PayrollDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.PendingApprovalsResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.RecentActivityResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.RecruitmentPipelineResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.UpcomingBirthdayResponse;
import com.hrms.hr_payroll_management_system.dto.response.holiday.HolidayResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.AttendanceTrendPointResponse;
import java.util.List;
import java.time.LocalDate;



public interface DashboardService {

    DashboardSummaryResponse getSummary(Long departmentId);

    EmployeeDashboardResponse getEmployeeStats(Long departmentId);

    AttendanceDashboardResponse getAttendanceStats(LocalDate date);

    LeaveDashboardResponse getLeaveStats(Integer year);

    PayrollDashboardResponse getPayrollStats(Integer year, Integer month);

    OrganizationDashboardResponse getOrganizationStats();

    PendingApprovalsResponse getPendingApprovals();

    RecruitmentPipelineResponse getRecruitmentPipeline();

    Integer getTrainingCompletion();
    List<HolidayResponse> getUpcomingHolidays(int limit);

    List<UpcomingBirthdayResponse> getBirthdaysThisMonth();

    List<AnnouncementResponse> getRecentAnnouncements(int limit);

    List<ComplianceAlertResponse> getComplianceAlerts();

    List<RecentActivityResponse> getRecentActivity(int limit);

    List<AttendanceTrendPointResponse> getAttendanceTrend(int days);
}
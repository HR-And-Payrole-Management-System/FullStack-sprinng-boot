package com.hrms.hr_payroll_management_system.dto.response.attendance;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceMonthlySummaryResponse {

    private Long employeeId;

    private String employeeCode;

    private Integer year;

    private Integer month;

    private Long totalRecords;

    private Long presentDays;

    private Long lateDays;

    private Long halfDays;

    private Long absentDays;

    private Long totalWorkedMinutes;

    private Long totalOvertimeMinutes;
}
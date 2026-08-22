package com.hrms.hr_payroll_management_system.dto.response.report;

import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceReportResponse {

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private LocalDate workDate;
    private AttendanceStatus status;

    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;

    private Long workedMinutes;
    private Long lateMinutes;
    private Long overtimeMinutes;
}
package com.hrms.hr_payroll_management_system.dto.response.attendance;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceResponse {

    private Long id;

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private Long workScheduleId;
    private String workScheduleName;

    private LocalDate workDate;

    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;

    private String status;

    private Long workedMinutes;
    private Long lateMinutes;
    private Long earlyLeaveMinutes;
    private Long overtimeMinutes;

    private String note;
}
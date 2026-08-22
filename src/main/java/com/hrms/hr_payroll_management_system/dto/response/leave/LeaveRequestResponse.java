package com.hrms.hr_payroll_management_system.dto.response.leave;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class LeaveRequestResponse {

    private Long id;

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private Long leaveTypeId;
    private String leaveTypeName;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double totalDays;

    private String reason;

    private String status;

    private String reviewComment;
}
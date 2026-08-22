package com.hrms.hr_payroll_management_system.dto.response.report;

import com.hrms.hr_payroll_management_system.enums.LeaveRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveReportResponse {

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private String leaveTypeName;

    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalDays;

    private LeaveRequestStatus status;
}
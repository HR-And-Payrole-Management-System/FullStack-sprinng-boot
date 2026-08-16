package com.hrms.hr_payroll_management_system.dto.response.schedule;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EmployeeWorkScheduleResponse {

    private Long id;

    private Long employeeId;

    private String employeeCode;

    private String employeeName;

    private Long workScheduleId;

    private String workScheduleName;

    private LocalDate effectiveDate;

    private LocalDate endDate;
}
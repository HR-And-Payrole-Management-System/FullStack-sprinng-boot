package com.hrms.hr_payroll_management_system.dto.response.performance;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PerformanceGoalResponse {

    private Long id;

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private Long cycleId;
    private String cycleName;

    private String title;
    private String description;

    private BigDecimal weight;

    private BigDecimal progress;

    private LocalDate targetDate;

    private String status;
}
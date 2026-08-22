package com.hrms.hr_payroll_management_system.dto.response.performance;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PerformanceReviewResponse {

    private Long id;

    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private Long cycleId;
    private String cycleName;

    private BigDecimal selfRating;
    private String selfComment;

    private BigDecimal managerRating;
    private String managerComment;

    private BigDecimal goalScore;

    private BigDecimal finalScore;

    private String status;
}
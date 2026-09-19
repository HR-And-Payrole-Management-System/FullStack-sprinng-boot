package com.hrms.hr_payroll_management_system.dto.response.benefit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenefitEnrollmentResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long benefitRuleId;
    private String benefitRuleName;
    private String benefitType;
    private String status;
    private LocalDate effectiveDate;
    private LocalDate endDate;
}
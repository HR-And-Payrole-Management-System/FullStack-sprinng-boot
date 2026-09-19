
package com.hrms.hr_payroll_management_system.dto.request.benefit;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EnrollBenefitRequest {

    @NotNull
    private Long employeeId;

    @NotNull
    private Long benefitRuleId;

    @NotNull
    private LocalDate effectiveDate;
}
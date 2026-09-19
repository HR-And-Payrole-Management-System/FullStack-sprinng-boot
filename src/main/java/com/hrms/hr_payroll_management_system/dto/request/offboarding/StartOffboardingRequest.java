package com.hrms.hr_payroll_management_system.dto.request.offboarding;

import com.hrms.hr_payroll_management_system.enums.OffboardingReason;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StartOffboardingRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Template ID is required")
    private Long templateId;

    @NotNull(message = "Reason is required")
    private OffboardingReason reason;

    @NotNull(message = "Last working date is required")
    private LocalDate lastWorkingDate;
}
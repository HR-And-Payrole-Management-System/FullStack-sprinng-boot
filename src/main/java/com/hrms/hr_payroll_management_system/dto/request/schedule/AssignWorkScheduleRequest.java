package com.hrms.hr_payroll_management_system.dto.request.schedule;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AssignWorkScheduleRequest {

    @NotNull(message = "Work schedule ID is required")
    private Long workScheduleId;

    @NotNull(message = "Effective date is required")
    private LocalDate effectiveDate;

    private LocalDate endDate;

    @AssertTrue(
            message = "End date must be after or equal to effective date"
    )
    public boolean isDateRangeValid() {

        if (effectiveDate == null || endDate == null) {
            return true;
        }

        return !endDate.isBefore(effectiveDate);
    }
}
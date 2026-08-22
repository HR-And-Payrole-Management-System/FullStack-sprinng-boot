package com.hrms.hr_payroll_management_system.dto.request.performance;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreatePerformanceCycleRequest {

    @NotBlank(message = "Cycle name is required")
    @Size(max = 150)
    private String name;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @Size(max = 500)
    private String description;

    @AssertTrue(
            message = "End date must be after start date"
    )
    public boolean isDateRangeValid() {

        if (startDate == null || endDate == null) {
            return true;
        }

        return endDate.isAfter(startDate);
    }
}
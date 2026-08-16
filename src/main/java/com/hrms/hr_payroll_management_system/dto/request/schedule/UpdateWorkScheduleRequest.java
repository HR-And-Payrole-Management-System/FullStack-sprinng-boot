package com.hrms.hr_payroll_management_system.dto.request.schedule;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Data
public class UpdateWorkScheduleRequest {

    @NotBlank(message = "Schedule name is required")
    @Size(max = 100)
    private String name;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Break minutes is required")
    @Min(value = 0, message = "Break minutes cannot be negative")
    private Integer breakMinutes;

    @NotEmpty(message = "At least one working day is required")
    private Set<DayOfWeek> workingDays;
}
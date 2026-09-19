package com.hrms.hr_payroll_management_system.dto.request.training;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTrainingProgramRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150)
    private String title;

    @Size(max = 1000)
    private String description;

    @Size(max = 150)
    private String provider;

    @Min(value = 1, message = "Duration must be at least 1 hour")
    private Integer durationHours;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;
}
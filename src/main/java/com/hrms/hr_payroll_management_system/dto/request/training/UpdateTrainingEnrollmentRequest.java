package com.hrms.hr_payroll_management_system.dto.request.training;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTrainingEnrollmentRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDate completionDate;

    @DecimalMin(value = "0.0", message = "Score cannot be negative")
    @DecimalMax(value = "100.0", message = "Score cannot exceed 100")
    private Double score;

    @Size(max = 1000)
    private String certificateUrl;
}
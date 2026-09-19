package com.hrms.hr_payroll_management_system.dto.request.training;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTrainingEnrollmentRequest {

    @NotNull(message = "Employee is required")
    private Long employeeId;

    @NotNull(message = "Training program is required")
    private Long trainingProgramId;

    private LocalDate enrolledDate;
}
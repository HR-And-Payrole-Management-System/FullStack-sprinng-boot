package com.hrms.hr_payroll_management_system.dto.request.recruitment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateApplicationRequest {

    @NotNull(message = "Candidate is required")
    private Long candidateId;

    @NotNull(message = "Job posting is required")
    private Long jobPostingId;

    private LocalDate appliedDate;

    @Size(max = 1000)
    private String notes;
}
package com.hrms.hr_payroll_management_system.dto.request.recruitment;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateJobPostingRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150)
    private String title;

    @NotNull(message = "Department is required")
    private Long departmentId;

    private Long positionId;

    @NotBlank(message = "Employment type is required")
    private String employmentType;

    @Size(max = 2000)
    private String description;

    @Size(max = 2000)
    private String requirements;

    @NotNull(message = "Number of openings is required")
    @Min(value = 1, message = "Openings must be at least 1")
    private Integer openings;

    private LocalDate postedDate;

    private LocalDate closingDate;

    private String status;
}
package com.hrms.hr_payroll_management_system.dto.response.training;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TrainingProgramResponse {

    private Long id;

    private String title;

    private String description;

    private String provider;

    private Integer durationHours;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;

    private long enrollmentCount;

    private long completedCount;
}
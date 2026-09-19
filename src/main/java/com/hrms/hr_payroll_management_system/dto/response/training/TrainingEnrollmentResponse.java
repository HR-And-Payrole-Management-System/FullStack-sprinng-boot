package com.hrms.hr_payroll_management_system.dto.response.training;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TrainingEnrollmentResponse {

    private Long id;

    private Long employeeId;

    private String employeeName;

    private Long trainingProgramId;

    private String trainingProgramTitle;

    private String status;

    private LocalDate enrolledDate;

    private LocalDate completionDate;

    private Double score;

    private String certificateUrl;
}
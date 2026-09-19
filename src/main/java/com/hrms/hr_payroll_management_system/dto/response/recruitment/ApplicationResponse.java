package com.hrms.hr_payroll_management_system.dto.response.recruitment;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationResponse {

    private Long id;

    private Long candidateId;

    private String candidateName;

    private String candidateEmail;

    private Long jobPostingId;

    private String jobPostingTitle;

    private String stage;

    private LocalDate appliedDate;

    private String notes;
}
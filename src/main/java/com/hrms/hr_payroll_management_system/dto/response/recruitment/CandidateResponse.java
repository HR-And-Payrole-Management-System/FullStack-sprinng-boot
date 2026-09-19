package com.hrms.hr_payroll_management_system.dto.response.recruitment;

import lombok.Data;

@Data
public class CandidateResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String resumeUrl;

    private String resumeFileName;

    private String source;

    private String notes;

    private long applicationCount;
}
package com.hrms.hr_payroll_management_system.dto.response.recruitment;

import lombok.Data;

import java.time.LocalDate;

@Data
public class JobPostingResponse {

    private Long id;

    private String title;

    private Long departmentId;

    private String departmentName;

    private Long positionId;

    private String positionName;

    private String employmentType;

    private String description;

    private String requirements;

    private Integer openings;

    private LocalDate postedDate;

    private LocalDate closingDate;

    private String status;

    private long applicationCount;

    private long hiredCount;
}
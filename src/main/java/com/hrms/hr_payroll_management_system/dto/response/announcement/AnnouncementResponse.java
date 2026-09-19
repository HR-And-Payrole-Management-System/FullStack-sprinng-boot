package com.hrms.hr_payroll_management_system.dto.response.announcement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {

    private Long id;
    private String title;
    private String body;
    private LocalDate postedDate;
    private String postedByName;
    private Boolean active;
}
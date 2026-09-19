package com.hrms.hr_payroll_management_system.dto.request.announcement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateAnnouncementRequest {

    @NotBlank(message = "Title is required.")
    @Size(max = 200)
    private String title;

    @Size(max = 2000)
    private String body;

    private Long companyId;
    private Long branchId;
}
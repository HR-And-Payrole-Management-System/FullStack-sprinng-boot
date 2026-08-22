package com.hrms.hr_payroll_management_system.dto.request.leave;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateLeaveTypeRequest {

    @NotBlank(message = "Leave type name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 255)
    private String description;

    @NotNull
    @Min(0)
    private Integer defaultDays;

    @NotNull
    private Boolean paidLeave;
}
package com.hrms.hr_payroll_management_system.dto.request.attendance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdjustAttendanceRequest {

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @NotBlank(message = "Adjustment reason is required")
    @Size(max = 500)
    private String reason;
}
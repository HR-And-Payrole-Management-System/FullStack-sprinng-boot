package com.hrms.hr_payroll_management_system.dto.request.notification;

import com.hrms.hr_payroll_management_system.enums.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class CreateNotificationRequest {

    @NotNull
    private Long employeeId;

    @NotNull
    private NotificationType type;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String message;

    @Size(max = 100)
    private String referenceType;

    private Long referenceId;
}
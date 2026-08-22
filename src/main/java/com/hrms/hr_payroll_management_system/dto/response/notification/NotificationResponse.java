package com.hrms.hr_payroll_management_system.dto.response.notification;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private Long id;

    private Long employeeId;

    private String employeeCode;

    private String employeeName;

    private String type;

    private String title;

    private String message;

    private Boolean read;

    private String referenceType;

    private Long referenceId;

    private LocalDateTime createdAt;
}
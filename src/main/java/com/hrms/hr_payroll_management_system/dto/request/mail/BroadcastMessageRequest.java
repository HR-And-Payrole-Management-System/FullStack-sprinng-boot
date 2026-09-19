package com.hrms.hr_payroll_management_system.dto.request.mail;

import com.hrms.hr_payroll_management_system.enums.BroadcastTarget;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BroadcastMessageRequest {

    @NotNull(message = "Target type is required.")
    private BroadcastTarget targetType;

    private Long targetId; // required for DEPARTMENT / BRANCH / COMPANY

    private List<Long> recipientIds; // required for EMPLOYEE_LIST

    @NotBlank(message = "Subject is required.")
    @Size(max = 200)
    private String subject;

    @NotBlank(message = "Message body is required.")
    @Size(max = 4000)
    private String body;
}
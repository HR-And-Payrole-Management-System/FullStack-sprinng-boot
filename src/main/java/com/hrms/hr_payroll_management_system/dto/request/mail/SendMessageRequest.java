package com.hrms.hr_payroll_management_system.dto.request.mail;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotNull(message = "Recipient is required.")
    private Long recipientId;

    @NotBlank(message = "Subject is required.")
    @Size(max = 200)
    private String subject;

    @NotBlank(message = "Message body is required.")
    @Size(max = 4000)
    private String body;

    private Long parentMessageId;
}
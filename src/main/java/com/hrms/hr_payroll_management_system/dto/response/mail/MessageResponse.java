package com.hrms.hr_payroll_management_system.dto.response.mail;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MessageResponse {

    private Long id;

    private Long senderId;
    private String senderName;
    private String senderPhotoUrl;

    private Long recipientId;
    private String recipientName;
    private String recipientPhotoUrl;

    private String subject;
    private String body;
    private Boolean read;

    private Long parentMessageId;

    private LocalDateTime createdAt;

    private List<AttachmentResponse> attachments;
}
package com.hrms.hr_payroll_management_system.dto.response.mail;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ThreadSummaryResponse {
    private Long threadId;
    private String subject;
    private String lastMessageSnippet;
    private LocalDateTime lastMessageAt;
    private Long otherParticipantId;
    private String otherParticipantName;
    private String otherParticipantPhotoUrl;
    private long unreadCount;
    private boolean hasAttachments;
}
package com.hrms.hr_payroll_management_system.dto.response.mail;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BroadcastResponse {
    private String broadcastId;
    private int recipientCount;
    private String subject;
}
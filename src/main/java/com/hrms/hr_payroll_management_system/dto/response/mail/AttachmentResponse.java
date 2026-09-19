package com.hrms.hr_payroll_management_system.dto.response.mail;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttachmentResponse {
    private Long id;
    private String fileName;
    private String fileUrl;
    private String contentType;
    private Long fileSize;
}
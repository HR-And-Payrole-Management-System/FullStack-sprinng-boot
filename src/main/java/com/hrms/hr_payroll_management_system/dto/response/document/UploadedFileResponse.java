package com.hrms.hr_payroll_management_system.dto.response.document;

import lombok.Builder;
import lombok.Data;

@Data 
@Builder 
public class UploadedFileResponse {
    private String fileName;
    private String fileUrl;
}

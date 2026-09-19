package com.hrms.hr_payroll_management_system.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor 
public class PendingApprovalsResponse {
    private long leave;
    private long payroll;
    private long documents;
    private long recruitment;
}

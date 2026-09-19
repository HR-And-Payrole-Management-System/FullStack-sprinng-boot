package com.hrms.hr_payroll_management_system.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceAlertResponse {

    private String label;    // e.g. "Sokha Chan — Work Permit"
    private long daysLeft;
}
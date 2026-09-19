package com.hrms.hr_payroll_management_system.dto.response.integration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class IntegrationSummaryResponse {
    private long total;
    private long connected;
    private long disconnected;
}
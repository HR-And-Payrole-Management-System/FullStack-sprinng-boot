package com.hrms.hr_payroll_management_system.dto.response.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceTrendPointResponse {
    private String date;
    private long present;
    private long absent;
    private long late;
}

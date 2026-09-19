package com.hrms.hr_payroll_management_system.dto.response.recognition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {
    private Long employeeId;
    private String employeeName;
    private int totalPoints; // received, this month
    private int recognitionCount;
}
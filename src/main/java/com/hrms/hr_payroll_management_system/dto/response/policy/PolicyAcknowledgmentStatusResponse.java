package com.hrms.hr_payroll_management_system.dto.response.policy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyAcknowledgmentStatusResponse {
    private Long employeeId;
    private String employeeName;
    private boolean acknowledged;
}
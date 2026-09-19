package com.hrms.hr_payroll_management_system.dto.response.offboarding;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OffboardingProcessResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String templateName;
    private String reason;
    private LocalDate lastWorkingDate;
    private String status;
    private int progressPercent;
    private List<OffboardingTaskResponse> tasks;
}
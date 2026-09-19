package com.hrms.hr_payroll_management_system.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentPipelineResponse {

    private long applied;
    private long screening;
    private long interview;
    private long offer;
    private long hired;
}
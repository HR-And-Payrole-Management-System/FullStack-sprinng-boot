package com.hrms.hr_payroll_management_system.dto.response.succession;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeyPositionResponse {
    private Long id;
    private String positionName;
    private Long currentHolderId;
    private String currentHolderName;
    private String criticality;
    private String notes;
    private boolean atRisk; // true when there is no READY_NOW candidate
    private List<SuccessionCandidateResponse> candidates;
    private List<String> reportingChain;
}
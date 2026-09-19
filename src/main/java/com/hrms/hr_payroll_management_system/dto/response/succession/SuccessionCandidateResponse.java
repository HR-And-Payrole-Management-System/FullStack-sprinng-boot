package com.hrms.hr_payroll_management_system.dto.response.succession;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuccessionCandidateResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String potentialRating;
    private String readiness;
    private String developmentNotes;

    // Pulled live from the latest completed performance review — this is
    // what makes the 9-box grid real data, not a manual guess.
    private BigDecimal latestPerformanceScore;
    private String performanceBand;  // HIGH / MEDIUM / LOW, derived from the score
    private String nineBoxLabel;     // e.g. "Star", "High Potential", "Core Player", "Risk"
}
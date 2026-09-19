package com.hrms.hr_payroll_management_system.dto.response.compliance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceRequirementResponse {
    private Long id;
    private String name;
    private String type;
    private String scopeLabel; // "Company-wide" or a department name
    private int compliantCount;
    private int atRiskCount;
    private int nonCompliantCount;
    private int compliancePercent; // compliantCount / total, rounded
    private List<EmployeeComplianceResponse> employees;
    private Long documentTypeId;
    private Long trainingProgramId;
    private Long departmentId;
}
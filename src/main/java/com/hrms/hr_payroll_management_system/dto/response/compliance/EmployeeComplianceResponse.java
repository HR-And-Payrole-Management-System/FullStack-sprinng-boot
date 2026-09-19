package com.hrms.hr_payroll_management_system.dto.response.compliance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeComplianceResponse {
    private Long employeeId;
    private String employeeName;
    private String status;      // COMPLIANT / AT_RISK / NON_COMPLIANT
    private LocalDate expiryDate; // for document requirements, null for training
    private String detail;      // e.g. "Expires in 12 days" or "Not completed"
}
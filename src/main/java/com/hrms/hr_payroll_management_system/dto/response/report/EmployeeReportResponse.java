package com.hrms.hr_payroll_management_system.dto.response.report;

import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeReportResponse {

    private Long id;
    private String employeeCode;
    private String fullName;
    private String email;

    private String companyName;
    private String branchName;
    private String departmentName;
    private String positionName;

    private EmployeeStatus status;
    private LocalDate hireDate;
}
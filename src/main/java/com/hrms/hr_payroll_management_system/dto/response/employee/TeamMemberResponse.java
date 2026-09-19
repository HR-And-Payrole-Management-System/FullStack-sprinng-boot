package com.hrms.hr_payroll_management_system.dto.response.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberResponse {

    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String positionName;
    private String photoUrl;
    private String status;
}
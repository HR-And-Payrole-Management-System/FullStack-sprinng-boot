package com.hrms.hr_payroll_management_system.dto.response.orgchart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class OrgChartNodeResponse {

    private Long employeeId;
    private String employeeCode;
    private String fullName;
    private String email;
    private String photoUrl;

    private String positionName;
    private String positionLevel;
    private String departmentName;
    private String status;

    private Long managerId;
    private int directReportsCount;
    private int totalReportsCount; // full downstream headcount, computed bottom-up

    @Builder.Default
    private List<OrgChartNodeResponse> children = new ArrayList<>();

    
}
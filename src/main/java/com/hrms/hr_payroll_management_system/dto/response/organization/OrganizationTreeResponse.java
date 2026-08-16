package com.hrms.hr_payroll_management_system.dto.response.organization;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrganizationTreeResponse {

    private Long companyId;

    private String companyName;

    private List<BranchNode> branches;

    @Data
    @Builder
    public static class BranchNode {

        private Long id;

        private String code;

        private String name;

        private Boolean headOffice;

        private List<DepartmentNode> departments;
    }

    @Data
    @Builder
    public static class DepartmentNode {

        private Long id;

        private String name;

        private List<PositionNode> positions;
    }

    @Data
    @Builder
    public static class PositionNode {

        private Long id;

        private String name;

        private String level;

        private Long employeeCount;
    }
}
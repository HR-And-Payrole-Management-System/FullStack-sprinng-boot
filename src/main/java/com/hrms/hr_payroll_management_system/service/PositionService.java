package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.position.AssignPositionOrganizationRequest;
import com.hrms.hr_payroll_management_system.dto.request.position.CreatePositionRequest;
import com.hrms.hr_payroll_management_system.dto.request.position.UpdatePositionRequest;
import com.hrms.hr_payroll_management_system.dto.response.position.PositionResponse;

import java.util.List;

public interface PositionService {

    PositionResponse create(CreatePositionRequest request);

    List<PositionResponse> getAll();

    PositionResponse getById(Long id);

    PositionResponse update(
            Long id,
            UpdatePositionRequest request
    );

    void delete(Long id);

    PositionResponse assignOrganization(
        Long positionId,
        AssignPositionOrganizationRequest request
    );

    List<PositionResponse> getByCompanyId(
            Long companyId
    );

    List<PositionResponse> getByBranchId(
            Long branchId
    );

    List<PositionResponse> getByDepartmentId(
            Long departmentId
    );
}
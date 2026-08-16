package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.department.AssignDepartmentOrganizationRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.CreateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.UpdateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.response.department.DepartmentResponse;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse create(
            CreateDepartmentRequest request
    );

    List<DepartmentResponse> getAll();

    DepartmentResponse getById(
            Long id
    );

    List<DepartmentResponse> getByCompanyId(
            Long companyId
    );

    List<DepartmentResponse> getByBranchId(
            Long branchId
    );

    DepartmentResponse update(
            Long id,
            UpdateDepartmentRequest request
    );

    DepartmentResponse assignOrganization(
            Long departmentId,
            AssignDepartmentOrganizationRequest request
    );

    void delete(Long id);
}
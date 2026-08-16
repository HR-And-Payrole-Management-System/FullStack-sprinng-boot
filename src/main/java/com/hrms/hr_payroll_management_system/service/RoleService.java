package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.role.AssignPermissionsRequest;
import com.hrms.hr_payroll_management_system.dto.request.role.CreateRoleRequest;
import com.hrms.hr_payroll_management_system.dto.request.role.UpdateRoleRequest;
import com.hrms.hr_payroll_management_system.dto.response.role.RoleResponse;

public interface RoleService {

    RoleResponse create(CreateRoleRequest request);

    PageResponse<RoleResponse> getAll(
            int page,
            int size,
            String keyword,
            String sortBy,
            String direction
    );

    RoleResponse getById(Long id);

    RoleResponse update(Long id, UpdateRoleRequest request);

    RoleResponse assignPermissions(
            Long roleId,
            AssignPermissionsRequest request
    );

    RoleResponse removePermission(
            Long roleId,
            Long permissionId
    );

    void delete(Long id);

}
package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.permission.CreatePermissionRequest;
import com.hrms.hr_payroll_management_system.dto.request.permission.UpdatePermissionRequest;
import com.hrms.hr_payroll_management_system.dto.response.permission.PermissionResponse;

import java.util.List;

public interface PermissionService {

    PermissionResponse create(CreatePermissionRequest request);

    List<PermissionResponse> getAll();

    PermissionResponse getById(Long id);

    PermissionResponse update(Long id, UpdatePermissionRequest request);

    void delete(Long id);

}
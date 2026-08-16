package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.user.AssignRolesRequest;
import com.hrms.hr_payroll_management_system.dto.response.user.UserResponse;

public interface UserService {

    UserResponse getById(Long id);

    UserResponse assignRoles(
            Long userId,
            AssignRolesRequest request
    );

    UserResponse removeRole(
            Long userId,
            Long roleId
    );
}
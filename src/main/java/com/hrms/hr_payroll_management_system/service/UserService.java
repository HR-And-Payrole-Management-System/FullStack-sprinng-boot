package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.user.AssignRolesRequest;
import com.hrms.hr_payroll_management_system.dto.response.user.UserResponse;
import java.util.List;
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
    List<UserResponse> search(String keyword);
}
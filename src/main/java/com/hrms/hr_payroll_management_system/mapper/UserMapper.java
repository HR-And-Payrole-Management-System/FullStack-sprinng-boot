package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.auth.RegisterRequest;
import com.hrms.hr_payroll_management_system.dto.response.user.UserResponse;
import com.hrms.hr_payroll_management_system.entity.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = RoleMapper.class
)
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", ignore = true)
    User toEntity(RegisterRequest request);

    UserResponse toResponse(User user);
}
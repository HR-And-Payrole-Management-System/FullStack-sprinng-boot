package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.role.CreateRoleRequest;
import com.hrms.hr_payroll_management_system.dto.request.role.UpdateRoleRequest;
import com.hrms.hr_payroll_management_system.dto.response.role.RoleResponse;
import com.hrms.hr_payroll_management_system.entity.Role;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(
        componentModel = "spring",
        uses = PermissionMapper.class
)
public interface RoleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    @Mapping(target = "users", ignore = true)
    Role toEntity(CreateRoleRequest request);

    @Mapping(target = "permissions", source = "permissions")
    RoleResponse toResponse(Role role);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    @Mapping(target = "users", ignore = true)
    void updateEntity(
            UpdateRoleRequest request,
            @MappingTarget Role role
    );

}
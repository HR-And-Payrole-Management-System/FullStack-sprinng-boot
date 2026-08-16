package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.permission.CreatePermissionRequest;
import com.hrms.hr_payroll_management_system.dto.request.permission.UpdatePermissionRequest;
import com.hrms.hr_payroll_management_system.dto.response.permission.PermissionResponse;
import com.hrms.hr_payroll_management_system.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    Permission toEntity(CreatePermissionRequest request);    

    PermissionResponse toResponse(Permission permission);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateEntity(UpdatePermissionRequest request,
                        @MappingTarget Permission Permission
    );

}
package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.jobrole.CreateJobRoleRequest;
import com.hrms.hr_payroll_management_system.dto.request.jobrole.UpdateJobRoleRequest;
import com.hrms.hr_payroll_management_system.dto.response.jobrole.JobRoleResponse;
import com.hrms.hr_payroll_management_system.entity.JobRole;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface JobRoleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "status", ignore = true)
    JobRole toEntity(CreateJobRoleRequest request);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    JobRoleResponse toResponse(JobRole jobRole);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntity(
            UpdateJobRoleRequest request,
            @MappingTarget JobRole jobRole
    );
}
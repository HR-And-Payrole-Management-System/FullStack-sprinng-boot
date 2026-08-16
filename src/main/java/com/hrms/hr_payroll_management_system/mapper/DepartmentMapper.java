package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.department.CreateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.UpdateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.response.department.DepartmentResponse;
import com.hrms.hr_payroll_management_system.entity.Department;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "branch", ignore = true)
    Department toEntity(CreateDepartmentRequest request);

    @Mapping(target = "companyId", source = "company.id")
    @Mapping(target = "companyName", source = "company.name")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    DepartmentResponse toResponse(Department department);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "branch", ignore = true)
    void updateEntity(
            UpdateDepartmentRequest request,
            @MappingTarget Department department
    );
}
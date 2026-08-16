package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.position.CreatePositionRequest;
import com.hrms.hr_payroll_management_system.dto.request.position.UpdatePositionRequest;
import com.hrms.hr_payroll_management_system.dto.response.position.PositionResponse;
import com.hrms.hr_payroll_management_system.entity.Position;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PositionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "level", ignore = true)
    Position toEntity(CreatePositionRequest request);

    @Mapping(target = "companyId", source = "company.id")
    @Mapping(target = "companyName", source = "company.name")

    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    PositionResponse toResponse(Position position);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "level", ignore = true)
    void updateEntity(
            UpdatePositionRequest request,
            @MappingTarget Position position
    );
}
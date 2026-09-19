package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.location.CreateLocationRequest;
import com.hrms.hr_payroll_management_system.dto.request.location.UpdateLocationRequest;
import com.hrms.hr_payroll_management_system.dto.response.location.LocationResponse;
import com.hrms.hr_payroll_management_system.entity.Location;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "primary", ignore = true)
    Location toEntity(CreateLocationRequest request);

    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    LocationResponse toResponse(Location location);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "primary", ignore = true)
    void updateEntity(
            UpdateLocationRequest request,
            @MappingTarget Location location
    );
}
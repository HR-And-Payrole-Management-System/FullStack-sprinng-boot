package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.integration.CreateIntegrationRequest;
import com.hrms.hr_payroll_management_system.dto.response.integration.IntegrationResponse;
import com.hrms.hr_payroll_management_system.entity.Integration;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IntegrationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "isSystem", ignore = true)
    Integration toEntity(CreateIntegrationRequest request);

    @Mapping(target = "hasApiKey", expression = "java(integration.getApiKey() != null && !integration.getApiKey().isBlank())")
    IntegrationResponse toResponse(Integration integration);
}
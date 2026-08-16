package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.company.CreateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.request.company.UpdateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.response.company.CompanyResponse;
import com.hrms.hr_payroll_management_system.entity.Company;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CompanyMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "logoUrl", ignore = true)
    Company toEntity(CreateCompanyRequest request);

    CompanyResponse toResponse(Company company);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "logoUrl", ignore = true)
    void updateEntity(
            UpdateCompanyRequest request,
            @MappingTarget Company company
    );
}
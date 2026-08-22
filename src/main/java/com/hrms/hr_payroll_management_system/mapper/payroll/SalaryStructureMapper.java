package com.hrms.hr_payroll_management_system.mapper.payroll;

import com.hrms.hr_payroll_management_system.dto.request.payroll.CreateSalaryStructureRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.SalaryStructureResponse;
import com.hrms.hr_payroll_management_system.entity.payroll.SalaryStructure;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SalaryStructureMapper {

    @Mapping(target = "id", ignore = true)
    SalaryStructure toEntity(CreateSalaryStructureRequest request);

    SalaryStructureResponse toResponse(SalaryStructure entity);
}
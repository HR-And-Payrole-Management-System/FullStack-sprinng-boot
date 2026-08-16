package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.branch.CreateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.request.branch.UpdateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.response.branch.BranchResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BranchMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    Branch toEntity(CreateBranchRequest request);

    @Mapping(
            target = "companyId",
            source = "company.id"
    )
    @Mapping(
            target = "companyName",
            source = "company.name"
    )
    BranchResponse toResponse(Branch branch);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    void updateEntity(
            UpdateBranchRequest request,
            @MappingTarget Branch branch
    );
}
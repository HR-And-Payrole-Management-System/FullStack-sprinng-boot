package com.hrms.hr_payroll_management_system.mapper.recruitment;

import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.CandidateResponse;
import com.hrms.hr_payroll_management_system.entity.recruitment.Candidate;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CandidateMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "source", ignore = true)
    Candidate toEntity(CreateCandidateRequest request);

    @Mapping(target = "applicationCount", ignore = true)
    CandidateResponse toResponse(Candidate candidate);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "source", ignore = true)
    void updateEntity(
            UpdateCandidateRequest request,
            @MappingTarget Candidate candidate
    );
}
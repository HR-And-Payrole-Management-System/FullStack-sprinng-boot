package com.hrms.hr_payroll_management_system.mapper.recruitment;

import com.hrms.hr_payroll_management_system.dto.response.recruitment.ApplicationResponse;
import com.hrms.hr_payroll_management_system.entity.recruitment.Application;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {

    @Mapping(target = "candidateId", source = "candidate.id")
    @Mapping(
            target = "candidateName",
            expression = "java(application.getCandidate().getFirstName() + \" \" + application.getCandidate().getLastName())"
    )
    @Mapping(target = "candidateEmail", source = "candidate.email")
    @Mapping(target = "jobPostingId", source = "jobPosting.id")
    @Mapping(target = "jobPostingTitle", source = "jobPosting.title")
    ApplicationResponse toResponse(Application application);
}
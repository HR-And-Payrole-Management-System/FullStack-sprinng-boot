package com.hrms.hr_payroll_management_system.mapper.recruitment;

import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateJobPostingRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateJobPostingRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.JobPostingResponse;
import com.hrms.hr_payroll_management_system.entity.recruitment.JobPosting;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface JobPostingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "employmentType", ignore = true)
    @Mapping(target = "status", ignore = true)
    JobPosting toEntity(CreateJobPostingRequest request);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "positionId", source = "position.id")
    @Mapping(target = "positionName", source = "position.name")
    @Mapping(target = "applicationCount", ignore = true)
    @Mapping(target = "hiredCount", ignore = true)
    JobPostingResponse toResponse(JobPosting jobPosting);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "employmentType", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntity(
            UpdateJobPostingRequest request,
            @MappingTarget JobPosting jobPosting
    );
}
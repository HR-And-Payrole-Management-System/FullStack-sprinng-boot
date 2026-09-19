package com.hrms.hr_payroll_management_system.service.recruitment;

import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateJobPostingRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateJobPostingRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.JobPostingResponse;

import java.util.List;

public interface JobPostingService {

    JobPostingResponse create(CreateJobPostingRequest request);

    List<JobPostingResponse> getAll();

    JobPostingResponse getById(Long id);

    JobPostingResponse update(
            Long id,
            UpdateJobPostingRequest request
    );

    void delete(Long id);

    List<JobPostingResponse> getByDepartmentId(Long departmentId);
}
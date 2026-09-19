package com.hrms.hr_payroll_management_system.service.recruitment;

import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateApplicationRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateApplicationStageRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.ApplicationResponse;

import java.util.List;

public interface ApplicationService {

    ApplicationResponse create(CreateApplicationRequest request);

    List<ApplicationResponse> getAll();

    ApplicationResponse getById(Long id);

    ApplicationResponse updateStage(
            Long id,
            UpdateApplicationStageRequest request
    );

    void delete(Long id);

    List<ApplicationResponse> getByJobPostingId(Long jobPostingId);

    List<ApplicationResponse> getByCandidateId(Long candidateId);
}
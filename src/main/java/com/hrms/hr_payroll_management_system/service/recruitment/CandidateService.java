package com.hrms.hr_payroll_management_system.service.recruitment;

import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.CandidateResponse;

import java.util.List;

public interface CandidateService {

    CandidateResponse create(CreateCandidateRequest request);

    List<CandidateResponse> getAll();

    CandidateResponse getById(Long id);

    CandidateResponse update(
            Long id,
            UpdateCandidateRequest request
    );

    void delete(Long id);
}
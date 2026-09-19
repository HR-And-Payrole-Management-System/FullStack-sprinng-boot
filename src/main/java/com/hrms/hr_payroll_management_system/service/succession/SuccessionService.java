package com.hrms.hr_payroll_management_system.service.succession;

import com.hrms.hr_payroll_management_system.dto.request.succession.AddSuccessionCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.request.succession.CreateKeyPositionRequest;
import com.hrms.hr_payroll_management_system.dto.response.succession.KeyPositionResponse;

import java.util.List;

public interface SuccessionService {
    KeyPositionResponse createKeyPosition(CreateKeyPositionRequest request);
    KeyPositionResponse addCandidate(Long keyPositionId, AddSuccessionCandidateRequest request);
    List<KeyPositionResponse> getAll();
    List<KeyPositionResponse> getAtRisk();
    KeyPositionResponse updateKeyPosition(Long id, CreateKeyPositionRequest request);
    void deleteKeyPosition(Long id);
    KeyPositionResponse updateCandidate(Long candidateId, AddSuccessionCandidateRequest request);
    void deleteCandidate(Long candidateId);
}
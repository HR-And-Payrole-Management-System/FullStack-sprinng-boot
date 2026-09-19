package com.hrms.hr_payroll_management_system.service.okr;

import com.hrms.hr_payroll_management_system.dto.request.okr.CreateKeyResultRequest;
import com.hrms.hr_payroll_management_system.dto.request.okr.CreateObjectiveRequest;
import com.hrms.hr_payroll_management_system.dto.request.okr.UpdateKeyResultProgressRequest;
import com.hrms.hr_payroll_management_system.dto.response.okr.ObjectiveResponse;

import java.util.List;

public interface OkrService {
    ObjectiveResponse createObjective(CreateObjectiveRequest request);
    ObjectiveResponse addKeyResult(Long objectiveId, CreateKeyResultRequest request);
    ObjectiveResponse updateKeyResultProgress(Long keyResultId, UpdateKeyResultProgressRequest request);
    List<ObjectiveResponse> getTopLevelForCycle(Long cycleId);
    List<ObjectiveResponse> getForOwner(Long ownerId, Long cycleId);
}
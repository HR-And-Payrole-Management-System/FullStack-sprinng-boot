package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.offboarding.StartOffboardingRequest;
import com.hrms.hr_payroll_management_system.dto.response.offboarding.OffboardingProcessResponse;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingProcessResponse;

import java.util.List;

public interface OffboardingService {
    OffboardingProcessResponse start(StartOffboardingRequest request);
    OffboardingProcessResponse getByEmployeeId(Long employeeId);
    List<OffboardingProcessResponse> getActiveProcesses();
    OffboardingProcessResponse completeTask(Long taskId, Long completedByEmployeeId);
    OffboardingProcessResponse skipTask(Long taskId);

    List<OffboardingProcessResponse> getCompletedProcesses();  
}
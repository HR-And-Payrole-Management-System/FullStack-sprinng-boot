package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.onboarding.StartOnboardingRequest;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingProcessResponse;

import java.util.List;

public interface OnboardingService {

    OnboardingProcessResponse start(StartOnboardingRequest request);

    OnboardingProcessResponse getByEmployeeId(Long employeeId);

    List<OnboardingProcessResponse> getActiveProcesses();

    OnboardingProcessResponse completeTask(Long taskId, Long completedByEmployeeId);

    OnboardingProcessResponse skipTask(Long taskId);

    List<OnboardingProcessResponse> getCompletedProcesses();
}
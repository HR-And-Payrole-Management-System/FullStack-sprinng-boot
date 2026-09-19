package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.onboarding.CreateOnboardingTemplateRequest;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingTemplateResponse;

import java.util.List;

public interface OnboardingTemplateService {
    OnboardingTemplateResponse create(CreateOnboardingTemplateRequest request);
    List<OnboardingTemplateResponse> getAllActive();
    OnboardingTemplateResponse getById(Long id);
    OnboardingTemplateResponse update(Long id, CreateOnboardingTemplateRequest request);
    void delete(Long id);
}
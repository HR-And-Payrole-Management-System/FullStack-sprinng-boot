package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.offboarding.CreateOffboardingTemplateRequest;
import com.hrms.hr_payroll_management_system.dto.response.offboarding.OffboardingTemplateResponse;

import java.util.List;

public interface OffboardingTemplateService {
    OffboardingTemplateResponse create(CreateOffboardingTemplateRequest request);
    List<OffboardingTemplateResponse> getAllActive();
    OffboardingTemplateResponse getById(Long id);
    void delete(Long id);
}
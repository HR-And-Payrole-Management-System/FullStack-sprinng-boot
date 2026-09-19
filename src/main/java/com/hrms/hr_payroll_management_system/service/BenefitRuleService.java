package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.benefit.CreateBenefitRuleRequest;
import com.hrms.hr_payroll_management_system.dto.response.benefit.BenefitRuleResponse;

import java.util.List;

public interface BenefitRuleService {
    BenefitRuleResponse create(CreateBenefitRuleRequest request);
    List<BenefitRuleResponse> getAll();
    void deactivate(Long id);
}
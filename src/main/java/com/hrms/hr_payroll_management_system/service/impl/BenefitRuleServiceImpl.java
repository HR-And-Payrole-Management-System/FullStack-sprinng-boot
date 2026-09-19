package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.benefit.CreateBenefitRuleRequest;
import com.hrms.hr_payroll_management_system.dto.response.benefit.BenefitRuleResponse;
import com.hrms.hr_payroll_management_system.entity.payroll.BenefitRule;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.payroll.BenefitRuleRepository;
import com.hrms.hr_payroll_management_system.service.BenefitRuleService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BenefitRuleServiceImpl implements BenefitRuleService {

    private final BenefitRuleRepository benefitRuleRepository;

    @Override
    @Transactional
    public BenefitRuleResponse create(CreateBenefitRuleRequest request) {
        BenefitRule rule = BenefitRule.builder()
                .name(request.getName())
                .type(request.getType())
                .percentage(request.getPercentage())
                .fixedAmount(request.getFixedAmount())
                .active(true)
                .build();
        return toResponse(benefitRuleRepository.save(rule));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BenefitRuleResponse> getAll() {
        return benefitRuleRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deactivate(Long id) {
        BenefitRule rule = benefitRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefit rule not found: " + id));
        rule.setActive(false); // existing enrollments/payroll history stay intact
        benefitRuleRepository.save(rule);
    }

    private BenefitRuleResponse toResponse(BenefitRule r) {
        return BenefitRuleResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .type(r.getType().name())
                .percentage(r.getPercentage())
                .fixedAmount(r.getFixedAmount())
                .active(r.getActive())
                .build();
    }
}
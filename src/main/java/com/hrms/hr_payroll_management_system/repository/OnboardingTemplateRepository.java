package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.OnboardingTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OnboardingTemplateRepository extends JpaRepository<OnboardingTemplate, Long> {
    List<OnboardingTemplate> findByStatus(com.hrms.hr_payroll_management_system.enums.Status status);
}
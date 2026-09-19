package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.OffboardingTemplate;
import com.hrms.hr_payroll_management_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OffboardingTemplateRepository extends JpaRepository<OffboardingTemplate, Long> {
    List<OffboardingTemplate> findByStatus(Status status);
}
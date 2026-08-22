package com.hrms.hr_payroll_management_system.repository.payroll;

import com.hrms.hr_payroll_management_system.entity.payroll.BenefitRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BenefitRuleRepository
        extends JpaRepository<BenefitRule, Long> {

    List<BenefitRule> findByActiveTrue();
}
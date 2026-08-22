package com.hrms.hr_payroll_management_system.repository.payroll;

import com.hrms.hr_payroll_management_system.entity.payroll.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaryStructureRepository
        extends JpaRepository<SalaryStructure, Long> {

    boolean existsByName(String name);
}
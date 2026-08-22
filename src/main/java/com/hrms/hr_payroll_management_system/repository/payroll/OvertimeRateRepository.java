package com.hrms.hr_payroll_management_system.repository.payroll;

import com.hrms.hr_payroll_management_system.entity.payroll.OvertimeRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OvertimeRateRepository
        extends JpaRepository<OvertimeRate, Long> {

    Optional<OvertimeRate> findByName(String name);

    boolean existsByName(String name);
}
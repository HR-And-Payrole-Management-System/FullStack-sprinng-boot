package com.hrms.hr_payroll_management_system.repository.okr;

import com.hrms.hr_payroll_management_system.entity.okr.OkrCycle;
import com.hrms.hr_payroll_management_system.enums.OkrCycleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OkrCycleRepository extends JpaRepository<OkrCycle, Long> {
    List<OkrCycle> findByStatus(OkrCycleStatus status);
}
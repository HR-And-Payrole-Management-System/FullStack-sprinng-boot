package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveTypeRepository
        extends JpaRepository<LeaveType, Long> {

    boolean existsByName(String name);
}
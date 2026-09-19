package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.LeaveType;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hrms.hr_payroll_management_system.enums.Status;


public interface LeaveTypeRepository
        extends JpaRepository<LeaveType, Long> {

    boolean existsByName(String name);
    List<LeaveType> findByStatus(Status status);
}
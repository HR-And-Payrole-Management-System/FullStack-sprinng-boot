package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmergencyContactRepository
        extends JpaRepository<EmergencyContact, Long> {

    Optional<EmergencyContact> findByEmployeeId(Long employeeId);
}
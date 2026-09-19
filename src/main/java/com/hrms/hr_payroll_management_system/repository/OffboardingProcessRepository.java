package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.OffboardingProcess;
import com.hrms.hr_payroll_management_system.enums.OffboardingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OffboardingProcessRepository extends JpaRepository<OffboardingProcess, Long> {
    List<OffboardingProcess> findByStatus(OffboardingStatus status);
    Optional<OffboardingProcess> findByEmployeeIdAndStatusNot(Long employeeId, OffboardingStatus status);
    boolean existsByEmployeeIdAndStatusIn(Long employeeId, List<OffboardingStatus> statuses);
}
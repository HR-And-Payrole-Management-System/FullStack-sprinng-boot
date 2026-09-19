package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.OnboardingProcess;
import com.hrms.hr_payroll_management_system.enums.OnboardingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OnboardingProcessRepository extends JpaRepository<OnboardingProcess, Long> {
    List<OnboardingProcess> findByStatus(OnboardingStatus status);
    List<OnboardingProcess> findByEmployeeIdAndStatusNotOrderByIdDesc(Long employeeId, OnboardingStatus status);
    boolean existsByEmployeeIdAndStatusIn(Long employeeId, List<OnboardingStatus> statuses);
}
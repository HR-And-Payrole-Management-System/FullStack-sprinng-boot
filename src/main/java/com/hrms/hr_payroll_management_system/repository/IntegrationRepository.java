package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Integration;
import com.hrms.hr_payroll_management_system.enums.IntegrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IntegrationRepository extends JpaRepository<Integration, Long> {
    boolean existsByProviderKey(String providerKey);
    Optional<Integration> findByProviderKey(String providerKey);
    long countByStatus(IntegrationStatus status);
}
package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findFirstByOrderByIdAsc();
}
package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.IdCard;
import com.hrms.hr_payroll_management_system.enums.IdCardStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IdCardRepository extends JpaRepository<IdCard, Long> {

    Optional<IdCard> findByEmployeeId(Long employeeId);

    boolean existsByEmployeeId(Long employeeId);

    Page<IdCard> findByStatus(IdCardStatus status, Pageable pageable);
}
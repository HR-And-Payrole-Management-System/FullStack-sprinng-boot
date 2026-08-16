package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Role;


import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;



public interface RoleRepository extends JpaRepository<Role, Long> {

    boolean existsByName(String name);

    Page<Role> findByNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    Optional<Role> findByName(String name);

}
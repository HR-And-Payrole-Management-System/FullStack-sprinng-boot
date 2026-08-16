package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.EmailVerificationToken;
import com.hrms.hr_payroll_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepository
        extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByUser(User user);
}
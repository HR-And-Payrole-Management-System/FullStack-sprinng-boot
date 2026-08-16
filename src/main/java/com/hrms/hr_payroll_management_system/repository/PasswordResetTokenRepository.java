package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.PasswordResetToken;
import com.hrms.hr_payroll_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);
}
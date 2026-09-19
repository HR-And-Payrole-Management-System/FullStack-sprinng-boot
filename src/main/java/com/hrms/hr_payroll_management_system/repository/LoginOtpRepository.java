package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.LoginOtp;
import com.hrms.hr_payroll_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoginOtpRepository
        extends JpaRepository<LoginOtp, Long> {

    Optional<LoginOtp> findByPreAuthToken(String preAuthToken);

    void deleteByUser(User user);
}
package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.entity.EmailVerificationToken;
import com.hrms.hr_payroll_management_system.entity.User;

public interface EmailVerificationService {

    EmailVerificationToken create(User user);

    EmailVerificationToken verify(String token);

    void markUsed(EmailVerificationToken token);
}
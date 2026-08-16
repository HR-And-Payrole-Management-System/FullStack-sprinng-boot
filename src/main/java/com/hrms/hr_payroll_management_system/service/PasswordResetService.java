package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.entity.PasswordResetToken;
import com.hrms.hr_payroll_management_system.entity.User;

public interface PasswordResetService {

    PasswordResetToken create(User user);

    PasswordResetToken verify(String token);

    void markUsed(PasswordResetToken token);
}
package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.entity.User;

public interface AccountSecurityService {

    void validateAccount(User user);

    void handleFailedLogin(User user);

    void resetFailedLoginAttempts(User user);

    void unlockAccount(User user);
}
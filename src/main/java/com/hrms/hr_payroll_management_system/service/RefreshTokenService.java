package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.entity.RefreshToken;
import com.hrms.hr_payroll_management_system.entity.User;

public interface RefreshTokenService {

    RefreshToken create(User user);

    RefreshToken verify(String token);

    void revoke(String token);

    void revokeByUser(User user);
}
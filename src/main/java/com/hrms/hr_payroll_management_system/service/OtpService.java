package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.entity.LoginOtp;
import com.hrms.hr_payroll_management_system.entity.User;

public interface OtpService {

    // creates + emails a new OTP for this user, returns the LoginOtp
    // record (preAuthToken lives on it)
    LoginOtp generate(User user);

    // validates the code against the given preAuthToken; throws on
    // mismatch/expiry/too-many-attempts; returns the resolved LoginOtp
    // (caller can pull .getUser() from it) on success
    LoginOtp verify(String preAuthToken, String otpCode);

    void resend(String preAuthToken);
}
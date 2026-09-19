package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.auth.ChangePasswordRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.ForgotPasswordRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.LoginRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.RefreshTokenRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.RegisterRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.ResendOtpRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.ResendVerificationRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.ResetPasswordRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.VerifyEmailRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.VerifyOtpRequest;
import com.hrms.hr_payroll_management_system.dto.response.auth.CurrentUserResponse;
import com.hrms.hr_payroll_management_system.dto.response.auth.LoginChallengeResponse;
import com.hrms.hr_payroll_management_system.dto.response.auth.LoginResponse;
import com.hrms.hr_payroll_management_system.dto.response.user.UserResponse;
import com.hrms.hr_payroll_management_system.dto.request.auth.LogoutRequest;
import jakarta.servlet.http.HttpServletRequest;


public interface AuthService {

    UserResponse register(RegisterRequest request);

    // step 1: credentials + account validation → returns an OTP challenge,
    // NOT a real access/refresh token pair
    LoginChallengeResponse login(LoginRequest request);

    // step 3: OTP + device/session validation → returns the real tokens
    LoginResponse verifyOtp(VerifyOtpRequest request, HttpServletRequest httpRequest);

    void resendOtp(ResendOtpRequest request);

    LoginResponse refreshToken(RefreshTokenRequest request);

    void logout(LogoutRequest request);
    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
    void changePassword(
        String email,
        ChangePasswordRequest request
    );
    void verifyEmail(VerifyEmailRequest request);

    void resendVerification(
            ResendVerificationRequest request
    );
    CurrentUserResponse getCurrentUser(String email);
}
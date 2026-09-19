package com.hrms.hr_payroll_management_system.service;

public interface MailService {

    void sendPasswordResetEmail(
            String email,
            String resetToken
    );

    void sendEmailVerification(
            String email,
            String verificationToken
    );

    void sendOtpEmail(
            String email,
            String otpCode
    );

    void sendNewDeviceAlert(
            String email,
            String ipAddress,
            String userAgent
    );
        void sendContactFormEmail(
            String name,
            String senderEmail,
            String subject,
            String message
    );
}
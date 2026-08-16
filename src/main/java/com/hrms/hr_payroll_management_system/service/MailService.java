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
}
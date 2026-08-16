package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(
            String email,
            String resetToken
    ) {

        String resetLink =
                "http://localhost:8081/reset-password?token="
                        + resetToken;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("HRMS Password Reset");

        message.setText(
                "Hello,\n\n"
                + "We received a request to reset your password.\n\n"
                + "Reset your password using this link:\n"
                + resetLink
                + "\n\nThis link expires in 30 minutes."
        );

        mailSender.send(message);
    }
    @Override
        public void sendEmailVerification(
                String email,
                String verificationToken
        ) {

        String verificationLink =
                "http://localhost:8081/verify-email?token="
                        + verificationToken;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("HRMS Email Verification");

        message.setText(
                "Hello,\n\n"
                        + "Please verify your email address.\n\n"
                        + "Verification token:\n"
                        + verificationToken
                        + "\n\nVerification link:\n"
                        + verificationLink
                        + "\n\nThis link expires in 24 hours."
        );

        mailSender.send(message);
        }
}
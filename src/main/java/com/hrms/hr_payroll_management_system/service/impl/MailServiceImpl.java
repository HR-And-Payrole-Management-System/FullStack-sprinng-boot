package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Value("${app.contact.recipient-email}")
    private String contactRecipientEmail;

    @Override
    public void sendPasswordResetEmail(
            String email,
            String resetToken
    ) {

        String resetLink =
                "http://localhost:5173/reset-password?token="
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
                "http://localhost:5173/verify-email?token="
                        + verificationToken;

        String html =
                "<div style=\"font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#F8FAFC;\">"
                + "  <div style=\"font-family:'JetBrains Mono',monospace;font-weight:800;font-size:14px;letter-spacing:2px;color:#4C6FFF;margin-bottom:24px;\">HRMS</div>"
                + "  <h2 style=\"color:#0F172A;font-size:22px;margin:0 0 12px;\">Verify your email address</h2>"
                + "  <p style=\"color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px;\">"
                + "    Thanks for creating an account. Click the button below to verify your email and activate your workspace access. This link expires in 24 hours."
                + "  </p>"
                + "  <a href=\"" + verificationLink + "\" "
                + "     style=\"display:inline-block;background:#4C6FFF;color:#ffffff;text-decoration:none;"
                + "     font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;margin-bottom:28px;\">"
                + "    Verify Email"
                + "  </a>"
                + "  <p style=\"color:#94A3B8;font-size:12px;line-height:1.6;margin:0;\">"
                + "    If the button above doesn't work, copy and paste this link into your browser:<br/>"
                + "    <a href=\"" + verificationLink + "\" style=\"color:#4C6FFF;word-break:break-all;\">" + verificationLink + "</a>"
                + "  </p>"
                + "  <hr style=\"border:none;border-top:1px solid #E2E8F0;margin:28px 0 16px;\"/>"
                + "  <p style=\"color:#CBD5E1;font-size:11px;margin:0;\">If you didn't create an HRMS account, you can safely ignore this email.</p>"
                + "</div>";

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Verify your HRMS account");
            helper.setText(html, true); // true = HTML content

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("Failed to build verification email for {}", email, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    @Override
    public void sendOtpEmail(
            String email,
            String otpCode
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("HRMS Login Verification Code");

        message.setText(
                "Hello,\n\n"
                + "Your login verification code is:\n\n"
                + otpCode
                + "\n\nThis code expires in 5 minutes. "
                + "If you did not attempt to log in, please ignore this email "
                + "and consider changing your password."
        );

        mailSender.send(message);
    }

    @Override
    public void sendNewDeviceAlert(
            String email,
            String ipAddress,
            String userAgent
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("HRMS New Device Login Detected");

        message.setText(
                "Hello,\n\n"
                + "Your account was just used to log in from a new device.\n\n"
                + "IP address: " + ipAddress + "\n"
                + "Device: " + userAgent + "\n\n"
                + "If this was you, no action is needed. "
                + "If you don't recognize this activity, please reset your "
                + "password immediately."
        );

        mailSender.send(message);
    }

    @Override
    public void sendContactFormEmail(
            String name,
            String senderEmail,
            String subject,
            String message
    ) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(contactRecipientEmail);
        mail.setReplyTo(senderEmail);
        mail.setSubject("[Contact Form] " + subject);

        mail.setText(
                "New contact form submission\n\n"
                + "From: " + name + " <" + senderEmail + ">\n\n"
                + "Message:\n"
                + message
        );

        mailSender.send(mail);
    }

}
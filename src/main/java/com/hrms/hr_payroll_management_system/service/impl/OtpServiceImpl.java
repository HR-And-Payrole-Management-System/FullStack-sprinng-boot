package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.entity.LoginOtp;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.exception.UnauthorizedException;
import com.hrms.hr_payroll_management_system.repository.LoginOtpRepository;
import com.hrms.hr_payroll_management_system.service.MailService;
import com.hrms.hr_payroll_management_system.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OtpServiceImpl implements OtpService {

    private final LoginOtpRepository loginOtpRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    private static final long OTP_EXPIRATION_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final long RESEND_COOLDOWN_SECONDS = 60;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    public LoginOtp generate(User user) {

        // ចាស់ៗត្រូវលុបចោល — មួយ user គួរមាន OTP challenge សកម្មតែមួយប៉ុណ្ណោះ
        loginOtpRepository.deleteByUser(user);

        String rawCode = generateSixDigitCode();

        LoginOtp otp = LoginOtp.builder()
                .preAuthToken(UUID.randomUUID().toString())
                .otpCodeHash(passwordEncoder.encode(rawCode))
                .expiresAt(
                        LocalDateTime.now()
                                .plusMinutes(OTP_EXPIRATION_MINUTES)
                )
                .attempts(0)
                .maxAttempts(MAX_ATTEMPTS)
                .used(false)
                .lastSentAt(LocalDateTime.now())
                .user(user)
                .build();

        LoginOtp saved = loginOtpRepository.save(otp);

        mailService.sendOtpEmail(user.getEmail(), rawCode);

        return saved;
    }

    @Override
    public LoginOtp verify(String preAuthToken, String otpCode) {

        LoginOtp otp = loginOtpRepository
                .findByPreAuthToken(preAuthToken)
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Invalid or expired login session."
                        )
                );

        if (Boolean.TRUE.equals(otp.getUsed())) {
            throw new UnauthorizedException(
                    "Invalid or expired login session."
            );
        }

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException(
                    "OTP has expired. Please log in again."
            );
        }

        if (otp.getAttempts() >= otp.getMaxAttempts()) {

            // preAuthToken ត្រូវ invalidate ជាអចិន្ត្រៃយ៍ — ការពារ brute-force
            otp.setUsed(true);
            loginOtpRepository.save(otp);

            throw new UnauthorizedException(
                    "Too many incorrect attempts. Please log in again."
            );
        }

        if (!passwordEncoder.matches(otpCode, otp.getOtpCodeHash())) {

            otp.setAttempts(otp.getAttempts() + 1);
            loginOtpRepository.save(otp);

            throw new UnauthorizedException(
                    "Invalid OTP code."
            );
        }

        // ជោគជ័យ — ប្រើតែម្តង, block reuse ភ្លាមៗ
        otp.setUsed(true);
        loginOtpRepository.save(otp);

        return otp;
    }

    @Override
    public void resend(String preAuthToken) {

        LoginOtp otp = loginOtpRepository
                .findByPreAuthToken(preAuthToken)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Login session not found."
                        )
                );

        if (Boolean.TRUE.equals(otp.getUsed())) {
            throw new UnauthorizedException(
                    "Invalid or expired login session."
            );
        }

        if (otp.getLastSentAt() != null) {

            long secondsSinceLastSend = Duration.between(
                    otp.getLastSentAt(),
                    LocalDateTime.now()
            ).getSeconds();

            if (secondsSinceLastSend < RESEND_COOLDOWN_SECONDS) {

                throw new BadRequestException(
                        "Please wait before requesting another OTP."
                );
            }
        }

        String rawCode = generateSixDigitCode();

        otp.setOtpCodeHash(passwordEncoder.encode(rawCode));
        otp.setExpiresAt(
                LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES)
        );
        otp.setAttempts(0);
        otp.setLastSentAt(LocalDateTime.now());

        loginOtpRepository.save(otp);

        mailService.sendOtpEmail(otp.getUser().getEmail(), rawCode);
    }

    private String generateSixDigitCode() {

        int code = 100000 + RANDOM.nextInt(900000);

        return String.valueOf(code);
    }
}
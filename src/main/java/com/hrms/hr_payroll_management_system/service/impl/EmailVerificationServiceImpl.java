package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.entity.EmailVerificationToken;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmailVerificationTokenRepository;
import com.hrms.hr_payroll_management_system.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerificationServiceImpl
        implements EmailVerificationService {

    private final EmailVerificationTokenRepository repository;

    private static final long TOKEN_EXPIRATION_HOURS = 24;

    @Override
    public EmailVerificationToken create(User user) {

        repository.deleteByUser(user);

        EmailVerificationToken token =
                EmailVerificationToken.builder()
                        .token(UUID.randomUUID().toString())
                        .expiresAt(
                                LocalDateTime.now()
                                        .plusHours(TOKEN_EXPIRATION_HOURS)
                        )
                        .used(false)
                        .user(user)
                        .build();

        return repository.save(token);
    }

    @Override
    @Transactional(readOnly = true)
    public EmailVerificationToken verify(String token) {

        EmailVerificationToken verificationToken =
                repository.findByToken(token)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Email verification token not found."
                                )
                        );

        if (Boolean.TRUE.equals(verificationToken.getUsed())) {
            throw new BadRequestException(
                    "Email verification token has already been used."
            );
        }

        if (verificationToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new BadRequestException(
                    "Email verification token has expired."
            );
        }

        return verificationToken;
    }

    @Override
    public void markUsed(EmailVerificationToken token) {

        token.setUsed(true);

        repository.save(token);
    }
}
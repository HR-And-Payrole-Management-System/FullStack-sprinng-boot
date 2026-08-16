package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.entity.PasswordResetToken;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.PasswordResetTokenRepository;
import com.hrms.hr_payroll_management_system.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetServiceImpl implements PasswordResetService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    private static final long TOKEN_EXPIRATION_MINUTES = 30;

    @Override
    public PasswordResetToken create(User user) {

        passwordResetTokenRepository.deleteByUser(user);

        PasswordResetToken token = PasswordResetToken.builder()
                .token(UUID.randomUUID().toString())
                .expiresAt(
                        LocalDateTime.now()
                                .plusMinutes(TOKEN_EXPIRATION_MINUTES)
                )
                .used(false)
                .user(user)
                .build();

        return passwordResetTokenRepository.save(token);
    }

    @Override
    @Transactional(readOnly = true)
    public PasswordResetToken verify(String token) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Password reset token not found."
                                )
                        );

        if (Boolean.TRUE.equals(resetToken.getUsed())) {
            throw new BadRequestException(
                    "Password reset token has already been used."
            );
        }

        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new BadRequestException(
                    "Password reset token has expired."
            );
        }

        return resetToken;
    }

    @Override
    public void markUsed(PasswordResetToken token) {

        token.setUsed(true);

        passwordResetTokenRepository.save(token);
    }
}
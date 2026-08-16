package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.entity.RefreshToken;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.exception.UnauthorizedException;
import com.hrms.hr_payroll_management_system.repository.RefreshTokenRepository;
import com.hrms.hr_payroll_management_system.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private static final long REFRESH_TOKEN_DAYS = 7;

    @Override
    public RefreshToken create(User user) {

        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_DAYS))
                .revoked(false)
                .user(user)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    @Transactional(readOnly = true)
    public RefreshToken verify(String token) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Invalid refresh token."
                        )
                );

        if (Boolean.TRUE.equals(refreshToken.getRevoked())) {
            throw new UnauthorizedException(
                    "Refresh token has been revoked."
            );
        }

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException(
                    "Refresh token has expired."
            );
        }

        return refreshToken;
    }
    
    @Override
    public void revoke(String token) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Invalid refresh token."
                        )
                );

        refreshToken.setRevoked(true);

        refreshTokenRepository.save(refreshToken);
    }

    @Override
    public void revokeByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
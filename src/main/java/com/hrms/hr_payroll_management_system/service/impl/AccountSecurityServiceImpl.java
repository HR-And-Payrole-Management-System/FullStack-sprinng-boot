package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.config.SecurityProperties;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.enums.Status;
import com.hrms.hr_payroll_management_system.exception.UnauthorizedException;
import com.hrms.hr_payroll_management_system.repository.UserRepository;
import com.hrms.hr_payroll_management_system.service.AccountSecurityService;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AccountSecurityServiceImpl
        implements AccountSecurityService {

    private final UserRepository userRepository;
    private final SecurityProperties securityProperties;
    private final AccountSecurityService self;

    // Constructor សរសេរដោយដៃ (មិនប្រើ @RequiredArgsConstructor ទៀត) —
    // ព្រោះ @Lazy ត្រូវការភ្ជាប់ទៅ constructor PARAMETER ដោយផ្ទាល់
    // ទើប Spring ដឹងថាត្រូវ inject ជា lazy proxy។ Lombok មិន copy
    // @Lazy ពី field annotation ទៅ generated constructor ទេ
    public AccountSecurityServiceImpl(
            UserRepository userRepository,
            SecurityProperties securityProperties,
            @Lazy AccountSecurityService self
    ) {
        this.userRepository = userRepository;
        this.securityProperties = securityProperties;
        this.self = self;
    }

    @Override
    @Transactional
    public void validateAccount(User user) {

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new UnauthorizedException(
                    "Email is not verified."
            );
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new UnauthorizedException(
                    "Account is disabled."
            );
        }

        if (user.getStatus() != Status.ACTIVE) {
            throw new UnauthorizedException(
                    "Account is not active."
            );
        }

        if (Boolean.TRUE.equals(user.getAccountLocked())) {

            if (canAutoUnlock(user)) {
                self.unlockAccount(user);
                return;
            }

            throw new UnauthorizedException(
                    "Account is locked."
            );
        }
    }

    @Override
    @Transactional
    public void tryAutoUnlock(User user) {

        if (Boolean.TRUE.equals(user.getAccountLocked())
                && canAutoUnlock(user)) {

            self.unlockAccount(user);
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleFailedLogin(User user) {

        User currentUser = userRepository.findById(user.getId())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "User not found."
                        )
                );

        int attempts =
                currentUser.getFailedLoginAttempts() == null
                        ? 0
                        : currentUser.getFailedLoginAttempts();

        attempts++;

        currentUser.setFailedLoginAttempts(attempts);

        if (attempts >= securityProperties.getMaxFailedAttempts()) {

            currentUser.setAccountLocked(true);
            currentUser.setLockedAt(LocalDateTime.now());
        }

        userRepository.save(currentUser);

        user.setFailedLoginAttempts(
                currentUser.getFailedLoginAttempts()
        );

        user.setAccountLocked(
                currentUser.getAccountLocked()
        );

        user.setLockedAt(
                currentUser.getLockedAt()
        );
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void resetFailedLoginAttempts(User user) {

        User currentUser = userRepository.findById(user.getId())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "User not found."
                        )
                );

        currentUser.setFailedLoginAttempts(0);

        userRepository.save(currentUser);

        user.setFailedLoginAttempts(0);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void unlockAccount(User user) {

        User currentUser = userRepository.findById(user.getId())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "User not found."
                        )
                );

        currentUser.setAccountLocked(false);
        currentUser.setFailedLoginAttempts(0);
        currentUser.setLockedAt(null);

        userRepository.save(currentUser);

        user.setAccountLocked(false);
        user.setFailedLoginAttempts(0);
        user.setLockedAt(null);
    }

    private boolean canAutoUnlock(User user) {

        if (user.getLockedAt() == null) {
            return false;
        }

        LocalDateTime unlockTime =
                user.getLockedAt()
                        .plusMinutes(
                                securityProperties
                                        .getLockDurationMinutes()
                        );

        return LocalDateTime.now()
                .isAfter(unlockTime);
    }
}
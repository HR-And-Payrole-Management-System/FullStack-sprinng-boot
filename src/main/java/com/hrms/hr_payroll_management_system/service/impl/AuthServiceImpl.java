package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.auth.RegisterRequest;
import com.hrms.hr_payroll_management_system.dto.response.user.UserResponse;
import com.hrms.hr_payroll_management_system.entity.Role;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.exception.UnauthorizedException;
import com.hrms.hr_payroll_management_system.mapper.UserMapper;
import com.hrms.hr_payroll_management_system.repository.RoleRepository;
import com.hrms.hr_payroll_management_system.repository.UserRepository;
import com.hrms.hr_payroll_management_system.service.AccountSecurityService;
import com.hrms.hr_payroll_management_system.service.AuthService;
import com.hrms.hr_payroll_management_system.service.DeviceSessionService;
import com.hrms.hr_payroll_management_system.dto.request.auth.RefreshTokenRequest;
import com.hrms.hr_payroll_management_system.entity.RefreshToken;
import com.hrms.hr_payroll_management_system.service.RefreshTokenService;
import com.hrms.hr_payroll_management_system.dto.request.auth.LoginRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.LogoutRequest;
import com.hrms.hr_payroll_management_system.dto.response.auth.LoginResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.hrms.hr_payroll_management_system.security.CustomUserDetails;
import com.hrms.hr_payroll_management_system.security.JwtService;
import com.hrms.hr_payroll_management_system.dto.request.auth.ForgotPasswordRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.ResetPasswordRequest;
import com.hrms.hr_payroll_management_system.entity.PasswordResetToken;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.service.MailService;
import com.hrms.hr_payroll_management_system.service.PasswordResetService;
import com.hrms.hr_payroll_management_system.dto.request.auth.ChangePasswordRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.VerifyEmailRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.ResendVerificationRequest;
import com.hrms.hr_payroll_management_system.entity.EmailVerificationToken;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.service.EmailVerificationService;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.dto.request.auth.ResendOtpRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.VerifyOtpRequest;
import com.hrms.hr_payroll_management_system.dto.response.auth.LoginChallengeResponse;
import com.hrms.hr_payroll_management_system.entity.LoginOtp;
import com.hrms.hr_payroll_management_system.service.OtpService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import com.hrms.hr_payroll_management_system.dto.response.auth.CurrentUserResponse;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetService passwordResetService;
    private final MailService mailService;
    private final EmailVerificationService emailVerificationService;
    private final AccountSecurityService accountSecurityService;
    private final OtpService otpService;
    private final DeviceSessionService deviceSessionService;
    private final EmployeeRepository employeeRepository;

    public UserResponse register(RegisterRequest request) {

    if (userRepository.existsByEmail(request.getEmail())) {
        throw new DuplicateResourceException("Email already exists.");
    }

    Role defaultRole = roleRepository.findByName("EMPLOYEE")
            .orElseThrow(() -> new ResourceNotFoundException("Default EMPLOYEE role not found."));

    User user = userMapper.toEntity(request);
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setEmailVerified(false);
    user.getRoles().add(defaultRole);

    User savedUser = userRepository.save(user);

    EmailVerificationToken verificationToken =
            emailVerificationService.create(savedUser);

    // Retry sending the verification email up to 3 times before giving up.
    // Account creation must never roll back just because the mail server
    // hiccuped — but we no longer swallow the failure silently either.
    boolean emailSent = false;
    final int maxAttempts = 3;

    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            mailService.sendEmailVerification(
                    savedUser.getEmail(),
                    verificationToken.getToken()
            );
            emailSent = true;
            break;
        } catch (Exception ex) {
            log.error(
                    "Attempt {}/{} failed to send verification email to {}",
                    attempt, maxAttempts, savedUser.getEmail(), ex
            );
            if (attempt < maxAttempts) {
                try {
                    Thread.sleep(1000L * attempt); // 1s, then 2s backoff
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
    }

    if (!emailSent) {
        log.error(
                "Verification email permanently failed for {} after {} attempts — user must use resend-verification.",
                savedUser.getEmail(), maxAttempts
        );
    }

    UserResponse response = userMapper.toResponse(savedUser);
    response.setEmailSent(emailSent);
    return response;
}

    @Override
    public LoginChallengeResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Invalid email or password."
                        )
                );

        // ត្រូវឲ្យឱកាស auto-unlock មុននឹង Spring Security ឆែក isAccountNonLocked()
        accountSecurityService.tryAutoUnlock(user);

        // Step 2: ឆែក credentials — generic message ជានិច្ច
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (org.springframework.security.core.AuthenticationException ex) {

            if (ex instanceof BadCredentialsException) {
                accountSecurityService.handleFailedLogin(user);
            }

            throw new UnauthorizedException(
                    "Invalid email or password."
            );
        }

        // Step 2 (continued): ឆែក status ផ្សេងទៀត (emailVerified, status ACTIVE)
        try {
            accountSecurityService.validateAccount(user);
        } catch (UnauthorizedException ex) {
            throw new UnauthorizedException(
                    "Invalid email or password."
            );
        }

        accountSecurityService.resetFailedLoginAttempts(user);

        // Step 3 hand-off: credentials + account status OK → issue an OTP
        // challenge instead of real tokens. No token is granted yet.
        LoginOtp otp = otpService.generate(user);

        return LoginChallengeResponse.builder()
                .preAuthToken(otp.getPreAuthToken())
                .otpExpiresInSeconds(
                        Duration.between(
                                LocalDateTime.now(),
                                otp.getExpiresAt()
                        ).getSeconds()
                )
                .maskedEmail(maskEmail(user.getEmail()))
                .build();
    }
    

        @Override
    public LoginResponse verifyOtp(
            VerifyOtpRequest request,
            HttpServletRequest httpRequest
    ) {

        LoginOtp otp = otpService.verify(
                request.getPreAuthToken(),
                request.getOtpCode()
        );

        User user = otp.getUser();

        try {
            accountSecurityService.validateAccount(user);
        } catch (UnauthorizedException ex) {
            throw new UnauthorizedException(
                    "Invalid email or password."
            );
        }

        // Phase 4: Session & Device Validation
        deviceSessionService.identifyDevice(user, httpRequest);

                CustomUserDetails userDetails =
                new CustomUserDetails(user);

        String accessToken =
                jwtService.generateToken(
                        buildTokenClaims(userDetails),
                        userDetails
                );

        RefreshToken refreshToken =
                refreshTokenService.create(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(3600L)
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    public void resendOtp(ResendOtpRequest request) {

        otpService.resend(request.getPreAuthToken());
    }

    private String maskEmail(String email) {

        int at = email.indexOf('@');

        if (at <= 1) {
            return "***" + email.substring(at);
        }

        return email.charAt(0) + "***" + email.substring(at - 1);
    }

    @Override
    public LoginResponse refreshToken(
            RefreshTokenRequest request
    ) {

        RefreshToken refreshToken =
                refreshTokenService.verify(
                        request.getRefreshToken()
                );

        User user = refreshToken.getUser();

                CustomUserDetails userDetails =
                new CustomUserDetails(user);

        String newAccessToken =
                jwtService.generateToken(
                        buildTokenClaims(userDetails),
                        userDetails
                );
        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(3600L)
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    public void logout(LogoutRequest request) {

        refreshTokenService.revoke(
                request.getRefreshToken()
        );
    }

    @Override
        public void forgotPassword(
                ForgotPasswordRequest request
        ) {

        userRepository
                .findByEmail(request.getEmail())
                .ifPresent(user -> {

                        PasswordResetToken resetToken =
                                passwordResetService.create(user);

                        try {
                        mailService.sendPasswordResetEmail(
                                user.getEmail(),
                                resetToken.getToken()
                        );
                        } catch (Exception ex) {
                        // កុំឲ្យ mail failure បង្ហាញ 500 ដែលបញ្ចេញព័ត៌មាន
                        // enumeration (email នេះមានក្នុងប្រព័ន្ធ)
                        log.error("Failed to send password reset email to {}", user.getEmail(), ex);
                        }
                });
        }

    @Override
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new BadRequestException(
                    "Passwords do not match."
            );
        }

        PasswordResetToken resetToken =
                passwordResetService.verify(
                        request.getToken()
                );

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        passwordResetService.markUsed(resetToken);

        refreshTokenService.revokeByUser(user);
    }

    @Override
    public void changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {
            throw new BadRequestException(
                    "Current password is incorrect."
            );
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new BadRequestException(
                    "Passwords do not match."
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {
            throw new BadRequestException(
                    "New password must be different from current password."
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        refreshTokenService.revokeByUser(user);
    }

    @Override
    public void verifyEmail(
            VerifyEmailRequest request
    ) {

        EmailVerificationToken verificationToken =
                emailVerificationService.verify(
                        request.getToken()
                );

        User user = verificationToken.getUser();

        user.setEmailVerified(true);

        userRepository.save(user);

        emailVerificationService.markUsed(
                verificationToken
        );
    }

   @Override
        public void resendVerification(
                ResendVerificationRequest request
        ) {

        userRepository
                .findByEmail(request.getEmail())
                .filter(user -> !Boolean.TRUE.equals(user.getEmailVerified()))
                .ifPresent(user -> {

                        EmailVerificationToken token =
                                emailVerificationService.create(user);

                        try {
                        mailService.sendEmailVerification(
                                user.getEmail(),
                                token.getToken()
                        );
                        } catch (Exception ex) {
                        log.error("Failed to send verification email to {}", user.getEmail(), ex);
                        }
                });
        }

    @Override
                @Transactional(readOnly = true)
                public CurrentUserResponse getCurrentUser(String email) {

                User user = userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found."
                                )
                        );

                Set<String> roles = user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet());

                Set<String> permissions = user.getRoles()
                        .stream()
                        .flatMap(role -> role.getPermissions().stream())
                        .map(permission -> permission.getName())
                        .collect(Collectors.toSet());

                Employee employee = employeeRepository.findByUserId(user.getId())
                .orElse(null);

                Long employeeId = employee != null ? employee.getId() : null;
                String photoUrl = employee != null ? employee.getPhotoUrl() : null;

                return CurrentUserResponse.builder()
                        .id(user.getId())
                        .employeeId(employeeId)
                        .photoUrl(photoUrl)   // ⬅️ បន្ថែមថ្មី
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .status(user.getStatus().name())
                        .emailVerified(user.getEmailVerified())
                        .accountLocked(user.getAccountLocked())
                        .enabled(user.getEnabled())
                        .roles(roles)
                        .permissions(permissions)
                        .build();
                }

        private Map<String, Object> buildTokenClaims(
            CustomUserDetails userDetails
    ) {

        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();

        userDetails.getAuthorities().forEach(authority -> {

            String value = authority.getAuthority();

            if (value.startsWith("ROLE_")) {
                roles.add(value.substring(5));
            } else {
                permissions.add(value);
            }
        });

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("permissions", permissions);

        return claims;
    }

}
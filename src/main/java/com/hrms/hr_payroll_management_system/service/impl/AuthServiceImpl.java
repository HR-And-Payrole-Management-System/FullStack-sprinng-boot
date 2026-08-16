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
import com.hrms.hr_payroll_management_system.service.EmailVerificationService;

import org.springframework.security.authentication.BadCredentialsException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import com.hrms.hr_payroll_management_system.dto.response.auth.CurrentUserResponse;

import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
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
    
   
    
        
   
        @Override
        public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException(
                        "Email already exists."
                );
        }

        Role defaultRole = roleRepository.findByName("EMPLOYEE")
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Default EMPLOYEE role not found."
                        )
                );

        User user = userMapper.toEntity(request);

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setEmailVerified(false);

        user.getRoles().add(defaultRole);

        User savedUser = userRepository.save(user);

        EmailVerificationToken verificationToken =
                emailVerificationService.create(savedUser);

        mailService.sendEmailVerification(
                savedUser.getEmail(),
                verificationToken.getToken()
        );

        return userMapper.toResponse(savedUser);
        }   
        @Override
        public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Invalid email or password."
                        )
                );

        accountSecurityService.validateAccount(user);

        try {

                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        } catch (BadCredentialsException ex) {

                accountSecurityService.handleFailedLogin(user);

                if (Boolean.TRUE.equals(user.getAccountLocked())) {

                throw new UnauthorizedException(
                        "Account is locked due to too many failed login attempts."
                );
                }

                throw new UnauthorizedException(
                        "Invalid email or password."
                );
        }

        accountSecurityService.resetFailedLoginAttempts(user);

        CustomUserDetails userDetails =
                new CustomUserDetails(user);

        String accessToken =
                jwtService.generateToken(userDetails);

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
                jwtService.generateToken(userDetails);

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

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );

        PasswordResetToken resetToken =
                passwordResetService.create(user);

        mailService.sendPasswordResetEmail(
                user.getEmail(),
                resetToken.getToken()
        );
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

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
                throw new BadRequestException(
                        "Email is already verified."
                );
        }

        EmailVerificationToken token =
                emailVerificationService.create(user);

        mailService.sendEmailVerification(
                user.getEmail(),
                token.getToken()
        );
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

        return CurrentUserResponse.builder()
                .id(user.getId())
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
}
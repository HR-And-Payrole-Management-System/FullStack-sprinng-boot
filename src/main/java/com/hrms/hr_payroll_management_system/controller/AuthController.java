package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.auth.RegisterRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.ResetPasswordRequest;
import com.hrms.hr_payroll_management_system.dto.response.user.UserResponse;
import com.hrms.hr_payroll_management_system.service.AuthService;
import com.hrms.hr_payroll_management_system.dto.request.auth.ForgotPasswordRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.LoginRequest;
import com.hrms.hr_payroll_management_system.dto.response.auth.LoginResponse;
import com.hrms.hr_payroll_management_system.dto.request.auth.RefreshTokenRequest;
import jakarta.validation.Valid;
import com.hrms.hr_payroll_management_system.dto.request.auth.LogoutRequest;
import lombok.RequiredArgsConstructor;
import com.hrms.hr_payroll_management_system.dto.request.auth.ChangePasswordRequest;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hrms.hr_payroll_management_system.dto.request.auth.VerifyEmailRequest;
import com.hrms.hr_payroll_management_system.dto.request.auth.ResendVerificationRequest;
import com.hrms.hr_payroll_management_system.dto.response.auth.CurrentUserResponse;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        UserResponse user = authService.register(request);

        ApiResponse<UserResponse> response =
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User registered successfully.")
                        .data(user)
                        .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
         
                .body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {

        LoginResponse loginResponse = authService.login(request);

        ApiResponse<LoginResponse> response =
                ApiResponse.<LoginResponse>builder()
                        .success(true)
                        .message("Login successful.")
                        .data(loginResponse)
                        .build();

        return ResponseEntity.ok(response);
    }
    @PostMapping("/refresh-token")
        public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(
                @Valid @RequestBody RefreshTokenRequest request
        ) {

        LoginResponse loginResponse =
                authService.refreshToken(request);

        ApiResponse<LoginResponse> response =
                ApiResponse.<LoginResponse>builder()
                        .success(true)
                        .message("Access token refreshed successfully.")
                        .data(loginResponse)
                        .build();

        return ResponseEntity.ok(response);
        }
        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<Void>> logout(
                @Valid @RequestBody LogoutRequest request
        ) {

        authService.logout(request);

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Logout successful.")
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
        }
        @PostMapping("/forgot-password")
        public ResponseEntity<ApiResponse<Void>> forgotPassword(
                @Valid @RequestBody ForgotPasswordRequest request
        ) {

        authService.forgotPassword(request);

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message(
                                "Password reset instructions have been sent."
                        )
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
        }
        @PostMapping("/reset-password")
        public ResponseEntity<ApiResponse<Void>> resetPassword(
                @Valid @RequestBody ResetPasswordRequest request
        ) {

        authService.resetPassword(request);

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message(
                                "Password reset successfully."
                        )
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
        }
        @PutMapping("/change-password")
        public ResponseEntity<ApiResponse<Void>> changePassword(
                Authentication authentication,
                @Valid @RequestBody ChangePasswordRequest request
        ) {

        authService.changePassword(
                authentication.getName(),
                request
        );

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Password changed successfully.")
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
        }
        @PostMapping("/verify-email")
        public ResponseEntity<ApiResponse<Void>> verifyEmail(
                @Valid @RequestBody VerifyEmailRequest request
        ) {

        authService.verifyEmail(request);

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Email verified successfully.")
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
        }
        @PostMapping("/resend-verification")
        public ResponseEntity<ApiResponse<Void>> resendVerification(
                @Valid @RequestBody ResendVerificationRequest request
        ) {

        authService.resendVerification(request);

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Verification email sent successfully.")
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
        }
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<CurrentUserResponse>> me(
                Authentication authentication
        ) {

        CurrentUserResponse currentUser =
                authService.getCurrentUser(
                        authentication.getName()
                );

        ApiResponse<CurrentUserResponse> response =
                ApiResponse.<CurrentUserResponse>builder()
                        .success(true)
                        .message("Current user retrieved successfully.")
                        .data(currentUser)
                        .build();

        return ResponseEntity.ok(response);
        }
        
}

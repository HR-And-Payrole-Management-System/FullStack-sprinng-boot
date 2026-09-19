package com.hrms.hr_payroll_management_system.entity;

import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginOtp extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // opaque random id returned to the client after step 1 (login).
    // Never contains the OTP itself.
    @Column(name = "pre_auth_token", nullable = false, unique = true, length = 255)
    private String preAuthToken;

    // OTP is hashed with the same PasswordEncoder as user passwords —
    // never store the plaintext code.
    @Column(name = "otp_code_hash", nullable = false, length = 255)
    private String otpCodeHash;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private Integer attempts = 0;

    @Column(name = "max_attempts", nullable = false)
    @Builder.Default
    private Integer maxAttempts = 5;

    @Column(nullable = false)
    @Builder.Default
    private Boolean used = false;

    // cooldown guard for resend-otp
    @Column(name = "last_sent_at")
    private LocalDateTime lastSentAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
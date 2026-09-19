package com.hrms.hr_payroll_management_system.dto.response.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrTokenResponse {

    private Long branchId;
    private String branchName;

    // The raw string that should be encoded into the QR image
    // shown on the kiosk/reception screen.
    private String token;

    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private int rotationSeconds;
}
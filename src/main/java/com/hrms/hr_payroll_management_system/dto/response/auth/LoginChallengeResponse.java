package com.hrms.hr_payroll_management_system.dto.response.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginChallengeResponse {

    // opaque id the client must send back with the OTP in step 3.
    // Contains no sensitive data — safe to expose.
    private String preAuthToken;

    private Long otpExpiresInSeconds;

    // e.g. "j***@example.com" — never the full address
    private String maskedEmail;
}
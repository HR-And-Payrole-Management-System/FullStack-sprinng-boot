package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.response.attendance.QrTokenResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.service.AttendanceQrService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;

// Stateless, HMAC-signed rotating QR token for company-premises
// check-in/out. No database table is needed: the token itself
// encodes the branch and a time "bucket", signed with a server
// secret, so it can be verified without persisting anything.
//
// A kiosk/reception screen polls generateToken() and displays the
// result as a QR code. Employees scan it with their own phone
// (already logged in to the app), which calls validateToken() and
// then records the check-in/out against their own employee record.
//
// Because the token rotates every `rotation-seconds`, a photo of
// the screen taken by someone off-site stops working almost
// immediately — this is what makes the check-in "real" (tied to
// physically being at the branch when the code is scanned) rather
// than a button anyone could tap from anywhere.
@Service
@RequiredArgsConstructor
public class AttendanceQrServiceImpl implements AttendanceQrService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final BranchRepository branchRepository;

    @Value("${app.attendance.qr.secret}")
    private String qrSecret;

    @Value("${app.attendance.qr.rotation-seconds:20}")
    private int rotationSeconds;

    @Override
    public QrTokenResponse generateToken(Long branchId) {

        Branch branch =
                branchRepository.findById(branchId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Branch not found."
                                )
                        );

        long nowEpochSecond = Instant.now().getEpochSecond();
        long bucket = nowEpochSecond / rotationSeconds;

        String payload = branchId + ":" + bucket;
        String token = encode(payload) + "." + sign(payload);

        long bucketStartEpoch = bucket * rotationSeconds;
        long bucketEndEpoch = bucketStartEpoch + rotationSeconds;

        return QrTokenResponse.builder()
                .branchId(branch.getId())
                .branchName(branch.getName())
                .token(token)
                .issuedAt(toLocalDateTime(bucketStartEpoch))
                .expiresAt(toLocalDateTime(bucketEndEpoch))
                .rotationSeconds(rotationSeconds)
                .build();
    }

    @Override
    public Long validateToken(String token) {

        if (token == null || token.isBlank() || !token.contains(".")) {
            throw new BadRequestException("Invalid QR code.");
        }

        String[] parts = token.split("\\.", 2);

        if (parts.length != 2) {
            throw new BadRequestException("Invalid QR code.");
        }

        String encodedPayload = parts[0];
        String providedSignature = parts[1];

        String payload = decode(encodedPayload);
        String expectedSignature = sign(payload);

        if (!constantTimeEquals(expectedSignature, providedSignature)) {
            throw new BadRequestException(
                    "Invalid or tampered QR code."
            );
        }

        String[] payloadParts = payload.split(":");

        if (payloadParts.length != 2) {
            throw new BadRequestException("Invalid QR code.");
        }

        Long branchId;
        long bucket;

        try {
            branchId = Long.parseLong(payloadParts[0]);
            bucket = Long.parseLong(payloadParts[1]);
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid QR code.");
        }

        long currentBucket =
                Instant.now().getEpochSecond() / rotationSeconds;

        // Accept the current window and the one immediately before
        // it, to absorb scan/network latency right at the rotation
        // boundary. Anything older than that is rejected.
        if (bucket != currentBucket && bucket != currentBucket - 1) {
            throw new BadRequestException(
                    "This QR code has expired. Please scan the current code on screen."
            );
        }

        return branchId;
    }

    private String sign(String payload) {

        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);

            mac.init(
                    new SecretKeySpec(
                            qrSecret.getBytes(StandardCharsets.UTF_8),
                            HMAC_ALGORITHM
                    )
            );

            byte[] raw =
                    mac.doFinal(
                            payload.getBytes(StandardCharsets.UTF_8)
                    );

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(raw);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Unable to sign QR token.",
                    e
            );
        }
    }

    private String encode(String value) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String decode(String value) {
        try {
            return new String(
                    Base64.getUrlDecoder().decode(value),
                    StandardCharsets.UTF_8
            );
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid QR code.");
        }
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null || a.length() != b.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }

    private LocalDateTime toLocalDateTime(long epochSecond) {
        return LocalDateTime.ofInstant(
                Instant.ofEpochSecond(epochSecond),
                ZoneId.systemDefault()
        );
    }
}
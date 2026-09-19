package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.attendance.QrScanRequest;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceResponse;
import com.hrms.hr_payroll_management_system.dto.response.attendance.QrTokenResponse;
import com.hrms.hr_payroll_management_system.service.AttendanceQrService;
import com.hrms.hr_payroll_management_system.service.AttendanceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/attendances/qr")
@RequiredArgsConstructor
public class AttendanceQrController {

    private final AttendanceQrService attendanceQrService;
    private final AttendanceService attendanceService;

    // Kiosk / reception device — displays this as a QR code that
    // employees scan when they physically arrive at the branch.
    @GetMapping("/branches/{branchId}/token")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ATTENDANCE_ADJUST')")
    public ResponseEntity<ApiResponse<QrTokenResponse>> generateToken(
            @PathVariable Long branchId
    ) {
        return ResponseEntity.ok(
                ApiResponse.<QrTokenResponse>builder()
                        .success(true)
                        .message("QR token generated successfully.")
                        .data(attendanceQrService.generateToken(branchId))
                        .build()
        );
    }

    // Employee — scans the kiosk's QR code with their own phone,
    // already logged in. Automatically checks in or out depending
    // on today's existing record.
    @PostMapping("/scan")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AttendanceResponse>> scan(
            @Valid @RequestBody QrScanRequest request,
            Authentication authentication
    ) {
        AttendanceResponse response =
                attendanceService.scanQr(
                        authentication.getName(),
                        request.getToken()
                );

        String message =
                response.getCheckOutTime() != null
                        ? "Check-out successful."
                        : "Check-in successful.";

        return ResponseEntity.ok(
                ApiResponse.<AttendanceResponse>builder()
                        .success(true)
                        .message(message)
                        .data(response)
                        .build()
        );
    }
}
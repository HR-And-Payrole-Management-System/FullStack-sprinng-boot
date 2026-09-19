package com.hrms.hr_payroll_management_system.dto.request.attendance;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QrScanRequest {

    @NotBlank(message = "QR token is required.")
    private String token;
}
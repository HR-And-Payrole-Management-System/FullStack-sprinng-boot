package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.response.attendance.QrTokenResponse;

public interface AttendanceQrService {
    
    QrTokenResponse generateToken(Long branchId);

    Long validateToken(String token);
}

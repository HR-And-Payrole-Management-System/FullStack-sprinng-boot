package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.attendance.AdjustAttendanceRequest;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceResponse;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceMonthlySummaryResponse;
import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;
import java.time.LocalDate;

public interface AttendanceService {

    AttendanceResponse checkIn(Long employeeId);

    AttendanceResponse checkOut(Long employeeId);

    AttendanceResponse getById(Long id);

    AttendanceResponse adjust(
        Long attendanceId,
        AdjustAttendanceRequest request
    );

    PageResponse<AttendanceResponse> search(
        int page,
        int size,
        Long employeeId,
        Long departmentId,
        Long branchId,
        AttendanceStatus status,
        LocalDate startDate,
        LocalDate endDate
);

AttendanceMonthlySummaryResponse getMonthlySummary(
        Long employeeId,
        int year,
        int month
);
}
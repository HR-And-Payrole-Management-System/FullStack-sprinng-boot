package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.attendance.AdjustAttendanceRequest;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceMonthlySummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.attendance.AttendanceResponse;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;
import com.hrms.hr_payroll_management_system.service.AttendanceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/attendances")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/employees/{employeeId}/check-in")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('ATTENDANCE_CREATE')"
    )
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkIn(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<AttendanceResponse>builder()
                        .success(true)
                        .message("Check-in successful.")
                        .data(
                                attendanceService.checkIn(
                                        employeeId
                                )
                        )
                        .build()
        );
    }

    @PostMapping("/employees/{employeeId}/check-out")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('ATTENDANCE_CREATE')"
    )
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkOut(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<AttendanceResponse>builder()
                        .success(true)
                        .message("Check-out successful.")
                        .data(
                                attendanceService.checkOut(
                                        employeeId
                                )
                        )
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('ATTENDANCE_VIEW')"
    )
    public ResponseEntity<ApiResponse<AttendanceResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<AttendanceResponse>builder()
                        .success(true)
                        .message("Attendance retrieved successfully.")
                        .data(attendanceService.getById(id))
                        .build()
        );
    }
    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('ATTENDANCE_VIEW')"
    )
    public ResponseEntity<ApiResponse<PageResponse<AttendanceResponse>>> search(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(required = false)
            Long employeeId,

            @RequestParam(required = false)
            Long departmentId,

            @RequestParam(required = false)
            Long branchId,

            @RequestParam(required = false)
            AttendanceStatus status,

            @RequestParam(required = false)
            LocalDate startDate,

            @RequestParam(required = false)
            LocalDate endDate
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<PageResponse<AttendanceResponse>>builder()
                        .success(true)
                        .message(
                                "Attendance records retrieved successfully."
                        )
                        .data(
                                attendanceService.search(
                                        page,
                                        size,
                                        employeeId,
                                        departmentId,
                                        branchId,
                                        status,
                                        startDate,
                                        endDate
                                )
                        )
                        .build()
        );
    }
    @GetMapping("/employees/{employeeId}/monthly-summary")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('ATTENDANCE_VIEW')"
    )
    public ResponseEntity<ApiResponse<AttendanceMonthlySummaryResponse>>
    getMonthlySummary(

            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<AttendanceMonthlySummaryResponse>builder()
                        .success(true)
                        .message(
                                "Monthly attendance summary retrieved successfully."
                        )
                        .data(
                                attendanceService
                                        .getMonthlySummary(
                                                employeeId,
                                                year,
                                                month
                                        )
                        )
                        .build()
        );
    }
    @PutMapping("/{id}/adjust")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('ATTENDANCE_ADJUST')"
    )
    public ResponseEntity<ApiResponse<AttendanceResponse>> adjust(
            @PathVariable Long id,
            @Valid @RequestBody AdjustAttendanceRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<AttendanceResponse>builder()
                        .success(true)
                        .message(
                                "Attendance adjusted successfully."
                        )
                        .data(
                                attendanceService.adjust(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }
        
}
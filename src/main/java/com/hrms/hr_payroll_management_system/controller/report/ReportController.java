package com.hrms.hr_payroll_management_system.controller.report;

import com.hrms.hr_payroll_management_system.dto.response.report.AttendanceReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.EmployeeReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.LeaveReportResponse;
import com.hrms.hr_payroll_management_system.dto.response.report.PayrollReportResponse;
import com.hrms.hr_payroll_management_system.service.report.ReportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Reporting APIs")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/employees")
    @Operation(summary = "Employee report, optionally filtered by department")
    public ResponseEntity<List<EmployeeReportResponse>> getEmployeeReport(
            @RequestParam(required = false) Long departmentId
    ) {
        return ResponseEntity.ok(
                reportService.getEmployeeReport(departmentId)
        );
    }

    @GetMapping("/attendance")
    @Operation(summary = "Attendance report between two dates")
    public ResponseEntity<List<AttendanceReportResponse>> getAttendanceReport(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        return ResponseEntity.ok(
                reportService.getAttendanceReport(startDate, endDate)
        );
    }

    @GetMapping("/leaves")
    @Operation(summary = "Leave report for a specific year")
    public ResponseEntity<List<LeaveReportResponse>> getLeaveReport(
            @RequestParam Integer year
    ) {
        return ResponseEntity.ok(reportService.getLeaveReport(year));
    }

    @GetMapping("/payroll")
    @Operation(summary = "Payroll report for a specific year/month")
    public ResponseEntity<List<PayrollReportResponse>> getPayrollReport(
            @RequestParam Integer year,
            @RequestParam Integer month
    ) {
        return ResponseEntity.ok(
                reportService.getPayrollReport(year, month)
        );
    }
}
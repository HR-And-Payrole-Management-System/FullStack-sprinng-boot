package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.leave.CreateLeaveRequest;
import com.hrms.hr_payroll_management_system.dto.request.leave.ReviewLeaveRequest;
import com.hrms.hr_payroll_management_system.dto.response.leave.LeaveRequestResponse;
import com.hrms.hr_payroll_management_system.service.LeaveService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/accrue")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_TYPE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<Integer>> accrue(
            @RequestParam Integer year
    ) {

        int created = leaveService.accrueYearlyBalances(year);

        return ResponseEntity.ok(
                ApiResponse.<Integer>builder()
                        .success(true)
                        .message(
                                created
                                        + " leave balance row(s) created."
                        )
                        .data(created)
                        .build()
        );
    }

    @GetMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_VIEW')"
    )
    public ResponseEntity<ApiResponse<PageResponse<LeaveRequestResponse>>> getByEmployeeId(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<LeaveRequestResponse>>builder()
                        .success(true)
                        .message(
                                "Employee leave requests retrieved successfully."
                        )
                        .data(
                                leaveService.getByEmployeeId(
                                        employeeId,
                                        page,
                                        size
                                )
                        )
                        .build()
        );
    }

    @PostMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_CREATE')"
    )
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> requestLeave(
            @PathVariable Long employeeId,
            @Valid @RequestBody CreateLeaveRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<LeaveRequestResponse>builder()
                                .success(true)
                                .message(
                                        "Leave request created successfully."
                                )
                                .data(
                                        leaveService.requestLeave(
                                                employeeId,
                                                request
                                        )
                                )
                                .build()
                );
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_APPROVE')"
    )
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> approve(
            @PathVariable Long id,
            @Valid @RequestBody ReviewLeaveRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LeaveRequestResponse>builder()
                        .success(true)
                        .message(
                                "Leave request approved successfully."
                        )
                        .data(
                                leaveService.approve(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_APPROVE')"
    )
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> reject(
            @PathVariable Long id,
            @Valid @RequestBody ReviewLeaveRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LeaveRequestResponse>builder()
                        .success(true)
                        .message(
                                "Leave request rejected successfully."
                        )
                        .data(
                                leaveService.reject(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> cancel(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LeaveRequestResponse>builder()
                        .success(true)
                        .message(
                                "Leave request cancelled successfully."
                        )
                        .data(
                                leaveService.cancel(id)
                        )
                        .build()
        );
    }
}
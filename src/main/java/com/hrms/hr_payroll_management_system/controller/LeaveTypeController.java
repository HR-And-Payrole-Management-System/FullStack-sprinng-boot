package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.leave.CreateLeaveTypeRequest;
import com.hrms.hr_payroll_management_system.dto.request.leave.UpdateLeaveTypeRequest;
import com.hrms.hr_payroll_management_system.dto.response.leave.LeaveTypeResponse;
import com.hrms.hr_payroll_management_system.service.LeaveTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leave-types")
@RequiredArgsConstructor
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_TYPE_CREATE')"
    )
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> create(
            @Valid @RequestBody CreateLeaveTypeRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<LeaveTypeResponse>builder()
                                .success(true)
                                .message(
                                        "Leave type created successfully."
                                )
                                .data(
                                        leaveTypeService.create(
                                                request
                                        )
                                )
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_TYPE_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<LeaveTypeResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<LeaveTypeResponse>>builder()
                        .success(true)
                        .message(
                                "Leave types retrieved successfully."
                        )
                        .data(
                                leaveTypeService.getAll()
                        )
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_TYPE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLeaveTypeRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LeaveTypeResponse>builder()
                        .success(true)
                        .message(
                                "Leave type updated successfully."
                        )
                        .data(
                                leaveTypeService.update(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LEAVE_TYPE_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        leaveTypeService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
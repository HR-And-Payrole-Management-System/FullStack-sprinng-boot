package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.schedule.AssignWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.response.schedule.EmployeeWorkScheduleResponse;
import com.hrms.hr_payroll_management_system.service.EmployeeWorkScheduleService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employee-work-schedules")
@RequiredArgsConstructor
public class EmployeeWorkScheduleController {

    private final EmployeeWorkScheduleService employeeWorkScheduleService;

    @PostMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('SCHEDULE_UPDATE')"
    )
    public ResponseEntity<
            ApiResponse<EmployeeWorkScheduleResponse>
            > assign(
            @PathVariable Long employeeId,
            @Valid @RequestBody AssignWorkScheduleRequest request
    ) {

        EmployeeWorkScheduleResponse assignment =
                employeeWorkScheduleService.assign(
                        employeeId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<EmployeeWorkScheduleResponse>builder()
                                .success(true)
                                .message(
                                        "Work schedule assigned to employee successfully."
                                )
                                .data(assignment)
                                .build()
                );
    }

    @GetMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('SCHEDULE_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<EmployeeWorkScheduleResponse>>
            > getByEmployee(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<EmployeeWorkScheduleResponse>>builder()
                        .success(true)
                        .message(
                                "Employee work schedules retrieved successfully."
                        )
                        .data(
                                employeeWorkScheduleService
                                        .getByEmployeeId(
                                                employeeId
                                        )
                        )
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('SCHEDULE_UPDATE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        employeeWorkScheduleService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}
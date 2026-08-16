package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.schedule.CreateWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.request.schedule.UpdateWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.response.schedule.WorkScheduleResponse;
import com.hrms.hr_payroll_management_system.service.WorkScheduleService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-schedules")
@RequiredArgsConstructor
public class WorkScheduleController {

    private final WorkScheduleService workScheduleService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('SCHEDULE_CREATE')"
    )
    public ResponseEntity<ApiResponse<WorkScheduleResponse>> create(
            @Valid @RequestBody CreateWorkScheduleRequest request
    ) {

        WorkScheduleResponse schedule =
                workScheduleService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<WorkScheduleResponse>builder()
                                .success(true)
                                .message(
                                        "Work schedule created successfully."
                                )
                                .data(schedule)
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('SCHEDULE_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<WorkScheduleResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<WorkScheduleResponse>>builder()
                        .success(true)
                        .message(
                                "Work schedules retrieved successfully."
                        )
                        .data(workScheduleService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('SCHEDULE_VIEW')"
    )
    public ResponseEntity<ApiResponse<WorkScheduleResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<WorkScheduleResponse>builder()
                        .success(true)
                        .message(
                                "Work schedule retrieved successfully."
                        )
                        .data(
                                workScheduleService.getById(id)
                        )
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('SCHEDULE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<WorkScheduleResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateWorkScheduleRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<WorkScheduleResponse>builder()
                        .success(true)
                        .message(
                                "Work schedule updated successfully."
                        )
                        .data(
                                workScheduleService.update(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('SCHEDULE_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        workScheduleService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}
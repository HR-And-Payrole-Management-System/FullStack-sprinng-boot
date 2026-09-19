package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.jobrole.CreateJobRoleRequest;
import com.hrms.hr_payroll_management_system.dto.request.jobrole.UpdateJobRoleRequest;
import com.hrms.hr_payroll_management_system.dto.response.jobrole.JobRoleResponse;
import com.hrms.hr_payroll_management_system.service.JobRoleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/job-roles")
@RequiredArgsConstructor
public class JobRoleController {

    private final JobRoleService jobRoleService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('JOB_ROLE_CREATE')"
    )
    public ResponseEntity<ApiResponse<JobRoleResponse>> create(
            @Valid @RequestBody CreateJobRoleRequest request
    ) {

        JobRoleResponse jobRole = jobRoleService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<JobRoleResponse>builder()
                                .success(true)
                                .message("Job role created successfully.")
                                .data(jobRole)
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('JOB_ROLE_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<JobRoleResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<JobRoleResponse>>builder()
                        .success(true)
                        .message("Job roles retrieved successfully.")
                        .data(jobRoleService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('JOB_ROLE_VIEW')"
    )
    public ResponseEntity<ApiResponse<JobRoleResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<JobRoleResponse>builder()
                        .success(true)
                        .message("Job role retrieved successfully.")
                        .data(jobRoleService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('JOB_ROLE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<JobRoleResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobRoleRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<JobRoleResponse>builder()
                        .success(true)
                        .message("Job role updated successfully.")
                        .data(jobRoleService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('JOB_ROLE_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        jobRoleService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('JOB_ROLE_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<JobRoleResponse>>> getByDepartment(
            @PathVariable Long departmentId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<JobRoleResponse>>builder()
                        .success(true)
                        .message("Department job roles retrieved successfully.")
                        .data(jobRoleService.getByDepartmentId(departmentId))
                        .build()
        );
    }
}
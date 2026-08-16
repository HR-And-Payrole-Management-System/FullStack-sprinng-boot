package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.permission.CreatePermissionRequest;
import com.hrms.hr_payroll_management_system.dto.request.permission.UpdatePermissionRequest;
import com.hrms.hr_payroll_management_system.dto.response.permission.PermissionResponse;
import com.hrms.hr_payroll_management_system.service.PermissionService;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERMISSION_CREATE')")
    public ResponseEntity<ApiResponse<PermissionResponse>> create(
            @Valid @RequestBody CreatePermissionRequest request) {

        PermissionResponse permission = permissionService.create(request);

        ApiResponse<PermissionResponse> response =
                ApiResponse.<PermissionResponse>builder()
                        .success(true)
                        .message("Permission created successfully.")
                        .data(permission)
                        .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERMISSION_VIEW')")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getAll() {

        List<PermissionResponse> permissions =
                permissionService.getAll();

        ApiResponse<List<PermissionResponse>> response =
                ApiResponse.<List<PermissionResponse>>builder()
                        .success(true)
                        .message("Permissions retrieved successfully.")
                        .data(permissions)
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERMISSION_VIEW')")
    public ResponseEntity<ApiResponse<PermissionResponse>> getById(
            @PathVariable Long id) {

        PermissionResponse permission =
                permissionService.getById(id);

        ApiResponse<PermissionResponse> response =
                ApiResponse.<PermissionResponse>builder()
                        .success(true)
                        .message("Permission retrieved successfully.")
                        .data(permission)
                        .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERMISSION_UPDATE')")
    public ResponseEntity<ApiResponse<PermissionResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePermissionRequest request) {

        PermissionResponse permission =
                permissionService.update(id, request);

        ApiResponse<PermissionResponse> response =
                ApiResponse.<PermissionResponse>builder()
                        .success(true)
                        .message("Permission updated successfully.")
                        .data(permission)
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERMISSION_DELETE')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        permissionService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
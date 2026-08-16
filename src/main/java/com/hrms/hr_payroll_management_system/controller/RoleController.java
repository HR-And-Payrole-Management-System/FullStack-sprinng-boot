package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.role.CreateRoleRequest;
import com.hrms.hr_payroll_management_system.dto.request.role.UpdateRoleRequest;
import com.hrms.hr_payroll_management_system.dto.response.role.RoleResponse;
import com.hrms.hr_payroll_management_system.service.RoleService;
import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.role.AssignPermissionsRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_CREATE')")
    public ResponseEntity<ApiResponse<RoleResponse>> create(
            @Valid @RequestBody CreateRoleRequest request) {

        RoleResponse role = roleService.create(request);

        ApiResponse<RoleResponse> response = ApiResponse.<RoleResponse>builder()
                .success(true)
                .message("Role created successfully.")
                .data(role)
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

        @GetMapping
        @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_VIEW')")
        public ResponseEntity<ApiResponse<PageResponse<RoleResponse>>> getAll(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size,
                @RequestParam(defaultValue = "") String keyword,
                @RequestParam(defaultValue = "id") String sortBy,
                @RequestParam(defaultValue = "asc") String direction
        ) {

        PageResponse<RoleResponse> roles = roleService.getAll(
                page,
                size,
                keyword,
                sortBy,
                direction
        );

        ApiResponse<PageResponse<RoleResponse>> response =
                ApiResponse.<PageResponse<RoleResponse>>builder()
                        .success(true)
                        .message("Roles retrieved successfully.")
                        .data(roles)
                        .build();

        return ResponseEntity.ok(response);
        }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_VIEW')")
    public ResponseEntity<ApiResponse<RoleResponse>> getById(
            @PathVariable Long id) {

        RoleResponse role = roleService.getById(id);

        ApiResponse<RoleResponse> response =
                ApiResponse.<RoleResponse>builder()
                        .success(true)
                        .message("Role retrieved successfully.")
                        .data(role)
                        .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_DELETE')")
    public ResponseEntity<ApiResponse<RoleResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request) {

        RoleResponse role = roleService.update(id, request);

        ApiResponse<RoleResponse> response =
                ApiResponse.<RoleResponse>builder()
                        .success(true)
                        .message("Role updated successfully.")
                        .data(role)
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_DELETE')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        roleService.delete(id);

        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_ASSIGN_PERMISSION')")
        public ResponseEntity<ApiResponse<RoleResponse>> removePermission(
                @PathVariable Long roleId,
                @PathVariable Long permissionId
        ) {

        RoleResponse role =
                roleService.removePermission(
                        roleId,
                        permissionId
                );

        ApiResponse<RoleResponse> response =
                ApiResponse.<RoleResponse>builder()
                        .success(true)
                        .message("Permission removed successfully.")
                        .data(role)
                        .build();

        return ResponseEntity.ok(response);
        }
    @PostMapping("/{roleId}/permissions")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_ASSIGN_PERMISSION')")
        public ResponseEntity<ApiResponse<RoleResponse>> assignPermissions(
                @PathVariable Long roleId,
                @Valid @RequestBody AssignPermissionsRequest request
        ) {

        RoleResponse role =
                roleService.assignPermissions(roleId, request);

        ApiResponse<RoleResponse> response =
                ApiResponse.<RoleResponse>builder()
                        .success(true)
                        .message("Permissions assigned successfully.")
                        .data(role)
                        .build();

        return ResponseEntity.ok(response);
        }
        
}
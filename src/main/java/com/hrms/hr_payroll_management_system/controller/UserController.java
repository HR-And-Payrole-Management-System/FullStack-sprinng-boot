package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.user.AssignRolesRequest;
import com.hrms.hr_payroll_management_system.dto.response.user.UserResponse;
import com.hrms.hr_payroll_management_system.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<UserResponse>> getById(
            @PathVariable Long id
    ) {

        UserResponse user = userService.getById(id);

        ApiResponse<UserResponse> response =
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User retrieved successfully.")
                        .data(user)
                        .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('USER_ASSIGN_ROLE')")
    public ResponseEntity<ApiResponse<UserResponse>> assignRoles(
            @PathVariable Long userId,
            @Valid @RequestBody AssignRolesRequest request
    ) {

        UserResponse user =
                userService.assignRoles(userId, request);

        ApiResponse<UserResponse> response =
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Roles assigned successfully.")
                        .data(user)
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('USER_ASSIGN_ROLE')")
    public ResponseEntity<ApiResponse<UserResponse>> removeRole(
            @PathVariable Long userId,
            @PathVariable Long roleId
    ) {

        UserResponse user =
                userService.removeRole(userId, roleId);

        ApiResponse<UserResponse> response =
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Role removed successfully.")
                        .data(user)
                        .build();

        return ResponseEntity.ok(response);
    }
}
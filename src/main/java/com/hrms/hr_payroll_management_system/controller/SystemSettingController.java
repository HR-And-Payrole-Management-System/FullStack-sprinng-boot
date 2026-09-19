package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.setting.UpdateSettingValueRequest;
import com.hrms.hr_payroll_management_system.dto.request.setting.UpsertSettingRequest;
import com.hrms.hr_payroll_management_system.dto.response.setting.SystemSettingResponse;
import com.hrms.hr_payroll_management_system.service.SystemSettingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('SETTINGS_VIEW')")
    public ResponseEntity<ApiResponse<List<SystemSettingResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.<List<SystemSettingResponse>>builder()
                        .success(true)
                        .message("Settings retrieved successfully.")
                        .data(systemSettingService.getAll())
                        .build()
        );
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('SETTINGS_VIEW')")
    public ResponseEntity<ApiResponse<List<SystemSettingResponse>>> getByCategory(
            @PathVariable String category
    ) {
        return ResponseEntity.ok(
                ApiResponse.<List<SystemSettingResponse>>builder()
                        .success(true)
                        .message("Settings retrieved successfully.")
                        .data(systemSettingService.getByCategory(category))
                        .build()
        );
    }

    @GetMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('SETTINGS_VIEW')")
    public ResponseEntity<ApiResponse<SystemSettingResponse>> getByKey(
            @PathVariable String key
    ) {
        return ResponseEntity.ok(
                ApiResponse.<SystemSettingResponse>builder()
                        .success(true)
                        .message("Setting retrieved successfully.")
                        .data(systemSettingService.getByKey(key))
                        .build()
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('SETTINGS_UPDATE')")
    public ResponseEntity<ApiResponse<SystemSettingResponse>> upsert(
            @Valid @RequestBody UpsertSettingRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<SystemSettingResponse>builder()
                                .success(true)
                                .message("Setting saved successfully.")
                                .data(systemSettingService.upsert(request))
                                .build()
                );
    }

    @PatchMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('SETTINGS_UPDATE')")
    public ResponseEntity<ApiResponse<SystemSettingResponse>> updateValue(
            @PathVariable String key,
            @Valid @RequestBody UpdateSettingValueRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.<SystemSettingResponse>builder()
                        .success(true)
                        .message("Setting updated successfully.")
                        .data(systemSettingService.updateValue(key, request))
                        .build()
        );
    }

    @DeleteMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('SETTINGS_DELETE')")
    public ResponseEntity<Void> delete(@PathVariable String key) {
        systemSettingService.delete(key);
        return ResponseEntity.noContent().build();
    }
}
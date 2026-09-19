package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.idcard.CreateIdCardRequest;
import com.hrms.hr_payroll_management_system.dto.request.idcard.UpdateIdCardRequest;
import com.hrms.hr_payroll_management_system.dto.response.idcard.IdCardResponse;
import com.hrms.hr_payroll_management_system.enums.IdCardStatus;
import com.hrms.hr_payroll_management_system.service.IdCardService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/id-cards")
@RequiredArgsConstructor
public class IdCardController {

    private final IdCardService idCardService;

    @PostMapping("/employees/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('IDCARD_MANAGE')")
    public ResponseEntity<ApiResponse<IdCardResponse>> create(
            @PathVariable Long employeeId,
            @Valid @RequestBody CreateIdCardRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<IdCardResponse>builder()
                        .success(true)
                        .message("ID card issued successfully.")
                        .data(idCardService.create(employeeId, request))
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('IDCARD_VIEW')")
    public ResponseEntity<ApiResponse<IdCardResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.<IdCardResponse>builder()
                        .success(true)
                        .message("ID card retrieved successfully.")
                        .data(idCardService.getById(id))
                        .build()
        );
    }

    @GetMapping("/employees/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('IDCARD_VIEW')")
    public ResponseEntity<ApiResponse<IdCardResponse>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(
                ApiResponse.<IdCardResponse>builder()
                        .success(true)
                        .message("ID card retrieved successfully.")
                        .data(idCardService.getByEmployee(employeeId))
                        .build()
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('IDCARD_VIEW')")
    public ResponseEntity<ApiResponse<PageResponse<IdCardResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) IdCardStatus status
    ) {
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<IdCardResponse>>builder()
                        .success(true)
                        .message("ID cards retrieved successfully.")
                        .data(idCardService.getAll(page, size, status))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('IDCARD_MANAGE')")
    public ResponseEntity<ApiResponse<IdCardResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateIdCardRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.<IdCardResponse>builder()
                        .success(true)
                        .message("ID card updated successfully.")
                        .data(idCardService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('IDCARD_MANAGE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        idCardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
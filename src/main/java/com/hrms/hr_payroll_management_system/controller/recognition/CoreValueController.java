package com.hrms.hr_payroll_management_system.controller.recognition;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.recognition.CreateCoreValueRequest;
import com.hrms.hr_payroll_management_system.dto.response.recognition.CoreValueResponse;
import com.hrms.hr_payroll_management_system.service.recognition.CoreValueService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/core-values")
@RequiredArgsConstructor
public class CoreValueController {

    private final CoreValueService coreValueService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CoreValueResponse>> create(@Valid @RequestBody CreateCoreValueRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<CoreValueResponse>builder()
                .success(true).message("Core value created.").data(coreValueService.create(request)).build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<CoreValueResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<CoreValueResponse>>builder()
                .success(true).message("Core values retrieved.").data(coreValueService.getAll()).build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        coreValueService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Core value deleted.").build());
    }
}
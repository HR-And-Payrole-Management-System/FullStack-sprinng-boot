package com.hrms.hr_payroll_management_system.controller.okr;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.okr.CreateOkrCycleRequest;
import com.hrms.hr_payroll_management_system.dto.response.okr.OkrCycleResponse;
import com.hrms.hr_payroll_management_system.service.okr.OkrCycleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/okr-cycles")
@RequiredArgsConstructor
public class OkrCycleController {

    private final OkrCycleService okrCycleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFORMANCE_CREATE')")
    public ResponseEntity<ApiResponse<OkrCycleResponse>> create(@Valid @RequestBody CreateOkrCycleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<OkrCycleResponse>builder()
                .success(true).message("OKR cycle created.").data(okrCycleService.create(request)).build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFORMANCE_VIEW')")
    public ResponseEntity<ApiResponse<List<OkrCycleResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<OkrCycleResponse>>builder()
                .success(true).message("OKR cycles retrieved.").data(okrCycleService.getAll()).build());
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OkrCycleResponse>> close(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<OkrCycleResponse>builder()
                .success(true).message("OKR cycle closed.").data(okrCycleService.close(id)).build());
    }
}
package com.hrms.hr_payroll_management_system.controller.okr;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.okr.CreateKeyResultRequest;
import com.hrms.hr_payroll_management_system.dto.request.okr.CreateObjectiveRequest;
import com.hrms.hr_payroll_management_system.dto.request.okr.UpdateKeyResultProgressRequest;
import com.hrms.hr_payroll_management_system.dto.response.okr.ObjectiveResponse;
import com.hrms.hr_payroll_management_system.service.okr.OkrService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/okr")
@RequiredArgsConstructor
public class OkrController {

    private final OkrService okrService;

    @PostMapping("/objectives")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFORMANCE_CREATE')")
    public ResponseEntity<ApiResponse<ObjectiveResponse>> createObjective(@Valid @RequestBody CreateObjectiveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ObjectiveResponse>builder()
                .success(true).message("Objective created.").data(okrService.createObjective(request)).build());
    }

    @PostMapping("/objectives/{objectiveId}/key-results")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFORMANCE_CREATE')")
    public ResponseEntity<ApiResponse<ObjectiveResponse>> addKeyResult(
            @PathVariable Long objectiveId, @Valid @RequestBody CreateKeyResultRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ObjectiveResponse>builder()
                .success(true).message("Key result added.").data(okrService.addKeyResult(objectiveId, request)).build());
    }

    @PutMapping("/key-results/{keyResultId}/progress")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFORMANCE_UPDATE')")
    public ResponseEntity<ApiResponse<ObjectiveResponse>> updateProgress(
            @PathVariable Long keyResultId, @Valid @RequestBody UpdateKeyResultProgressRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.<ObjectiveResponse>builder()
                .success(true).message("Progress updated.").data(okrService.updateKeyResultProgress(keyResultId, request)).build());
    }

    @GetMapping("/cycles/{cycleId}/objectives")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFORMANCE_VIEW')")
    public ResponseEntity<ApiResponse<List<ObjectiveResponse>>> getTopLevel(@PathVariable Long cycleId) {
        return ResponseEntity.ok(ApiResponse.<List<ObjectiveResponse>>builder()
                .success(true).message("Objectives retrieved.").data(okrService.getTopLevelForCycle(cycleId)).build());
    }
}
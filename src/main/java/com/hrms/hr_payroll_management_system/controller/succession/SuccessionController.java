package com.hrms.hr_payroll_management_system.controller.succession;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.succession.AddSuccessionCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.request.succession.CreateKeyPositionRequest;
import com.hrms.hr_payroll_management_system.dto.response.succession.KeyPositionResponse;
import com.hrms.hr_payroll_management_system.service.succession.SuccessionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/succession")
@RequiredArgsConstructor
public class SuccessionController {

    private final SuccessionService successionService;

    @PostMapping("/key-positions")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<KeyPositionResponse>> createKeyPosition(@Valid @RequestBody CreateKeyPositionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<KeyPositionResponse>builder()
                .success(true).message("Key position created.").data(successionService.createKeyPosition(request)).build());
    }

    @PostMapping("/key-positions/{keyPositionId}/candidates")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<KeyPositionResponse>> addCandidate(
            @PathVariable Long keyPositionId, @Valid @RequestBody AddSuccessionCandidateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<KeyPositionResponse>builder()
                .success(true).message("Candidate added.").data(successionService.addCandidate(keyPositionId, request)).build());
    }


    @GetMapping("/key-positions")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<KeyPositionResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<KeyPositionResponse>>builder()
                .success(true).message("Key positions retrieved.").data(successionService.getAll()).build());
    }

    @GetMapping("/key-positions/at-risk")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<KeyPositionResponse>>> getAtRisk() {
        return ResponseEntity.ok(ApiResponse.<List<KeyPositionResponse>>builder()
                .success(true).message("At-risk key positions retrieved.").data(successionService.getAtRisk()).build());
    }
    @PutMapping("/key-positions/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<KeyPositionResponse>> updateKeyPosition(
            @PathVariable Long id, @Valid @RequestBody CreateKeyPositionRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.<KeyPositionResponse>builder()
                .success(true).message("Key position updated.").data(successionService.updateKeyPosition(id, request)).build());
    }

    @DeleteMapping("/key-positions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteKeyPosition(@PathVariable Long id) {
        successionService.deleteKeyPosition(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Key position deleted.").build());
    }

    @PutMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<KeyPositionResponse>> updateCandidate(
            @PathVariable Long candidateId, @Valid @RequestBody AddSuccessionCandidateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.<KeyPositionResponse>builder()
                .success(true).message("Candidate updated.").data(successionService.updateCandidate(candidateId, request)).build());
    }

    @DeleteMapping("/candidates/{candidateId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<Void>> deleteCandidate(@PathVariable Long candidateId) {
        successionService.deleteCandidate(candidateId);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Candidate deleted.").build());
    }
}
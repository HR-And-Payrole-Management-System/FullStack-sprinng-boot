package com.hrms.hr_payroll_management_system.controller.recruitment;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.CandidateResponse;
import com.hrms.hr_payroll_management_system.service.recruitment.CandidateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recruitment/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_CREATE')"
    )
    public ResponseEntity<ApiResponse<CandidateResponse>> create(
            @Valid @RequestBody CreateCandidateRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<CandidateResponse>builder()
                                .success(true)
                                .message("Candidate created successfully.")
                                .data(candidateService.create(request))
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<CandidateResponse>>builder()
                        .success(true)
                        .message("Candidates retrieved successfully.")
                        .data(candidateService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<CandidateResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<CandidateResponse>builder()
                        .success(true)
                        .message("Candidate retrieved successfully.")
                        .data(candidateService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_UPDATE')"
    )
    public ResponseEntity<ApiResponse<CandidateResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCandidateRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<CandidateResponse>builder()
                        .success(true)
                        .message("Candidate updated successfully.")
                        .data(candidateService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_DELETE')"
    )
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        candidateService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
package com.hrms.hr_payroll_management_system.controller.recruitment;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateApplicationRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateApplicationStageRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.ApplicationResponse;
import com.hrms.hr_payroll_management_system.service.recruitment.ApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recruitment/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_CREATE')"
    )
    public ResponseEntity<ApiResponse<ApplicationResponse>> create(
            @Valid @RequestBody CreateApplicationRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<ApplicationResponse>builder()
                                .success(true)
                                .message("Application created successfully.")
                                .data(applicationService.create(request))
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<ApplicationResponse>>builder()
                        .success(true)
                        .message("Applications retrieved successfully.")
                        .data(applicationService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<ApplicationResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<ApplicationResponse>builder()
                        .success(true)
                        .message("Application retrieved successfully.")
                        .data(applicationService.getById(id))
                        .build()
        );
    }

    @PatchMapping("/{id}/stage")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_UPDATE')"
    )
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStage(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStageRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<ApplicationResponse>builder()
                        .success(true)
                        .message("Application stage updated successfully.")
                        .data(applicationService.updateStage(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_DELETE')"
    )
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        applicationService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/posting/{jobPostingId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getByPosting(
            @PathVariable Long jobPostingId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<ApplicationResponse>>builder()
                        .success(true)
                        .message("Applications retrieved successfully.")
                        .data(applicationService.getByJobPostingId(jobPostingId))
                        .build()
        );
    }

    @GetMapping("/candidate/{candidateId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getByCandidate(
            @PathVariable Long candidateId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<ApplicationResponse>>builder()
                        .success(true)
                        .message("Applications retrieved successfully.")
                        .data(applicationService.getByCandidateId(candidateId))
                        .build()
        );
    }
}
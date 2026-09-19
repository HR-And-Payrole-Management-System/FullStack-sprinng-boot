package com.hrms.hr_payroll_management_system.controller.recruitment;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateJobPostingRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateJobPostingRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.JobPostingResponse;
import com.hrms.hr_payroll_management_system.service.recruitment.JobPostingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recruitment/postings")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_CREATE')"
    )
    public ResponseEntity<ApiResponse<JobPostingResponse>> create(
            @Valid @RequestBody CreateJobPostingRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<JobPostingResponse>builder()
                                .success(true)
                                .message("Job posting created successfully.")
                                .data(jobPostingService.create(request))
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<JobPostingResponse>>builder()
                        .success(true)
                        .message("Job postings retrieved successfully.")
                        .data(jobPostingService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<JobPostingResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<JobPostingResponse>builder()
                        .success(true)
                        .message("Job posting retrieved successfully.")
                        .data(jobPostingService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_UPDATE')"
    )
    public ResponseEntity<ApiResponse<JobPostingResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobPostingRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<JobPostingResponse>builder()
                        .success(true)
                        .message("Job posting updated successfully.")
                        .data(jobPostingService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_DELETE')"
    )
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        jobPostingService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('RECRUITMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getByDepartment(
            @PathVariable Long departmentId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<JobPostingResponse>>builder()
                        .success(true)
                        .message("Department job postings retrieved successfully.")
                        .data(jobPostingService.getByDepartmentId(departmentId))
                        .build()
        );
    }
}
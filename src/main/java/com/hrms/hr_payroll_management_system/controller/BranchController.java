package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.branch.CreateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.request.branch.UpdateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.response.branch.BranchResponse;
import com.hrms.hr_payroll_management_system.service.BranchService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('BRANCH_CREATE')"
    )
    public ResponseEntity<ApiResponse<BranchResponse>> create(
            @Valid @RequestBody CreateBranchRequest request
    ) {

        BranchResponse branch =
                branchService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<BranchResponse>builder()
                                .success(true)
                                .message(
                                        "Branch created successfully."
                                )
                                .data(branch)
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('BRANCH_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<BranchResponse>>builder()
                        .success(true)
                        .message(
                                "Branches retrieved successfully."
                        )
                        .data(branchService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('BRANCH_VIEW')"
    )
    public ResponseEntity<ApiResponse<BranchResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<BranchResponse>builder()
                        .success(true)
                        .message(
                                "Branch retrieved successfully."
                        )
                        .data(branchService.getById(id))
                        .build()
        );
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('BRANCH_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getByCompanyId(
            @PathVariable Long companyId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<BranchResponse>>builder()
                        .success(true)
                        .message(
                                "Company branches retrieved successfully."
                        )
                        .data(
                                branchService.getByCompanyId(
                                        companyId
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('BRANCH_UPDATE')"
    )
    public ResponseEntity<ApiResponse<BranchResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBranchRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<BranchResponse>builder()
                        .success(true)
                        .message(
                                "Branch updated successfully."
                        )
                        .data(
                                branchService.update(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('BRANCH_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        branchService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}
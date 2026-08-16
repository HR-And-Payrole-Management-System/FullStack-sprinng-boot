package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.position.CreatePositionRequest;
import com.hrms.hr_payroll_management_system.dto.request.position.UpdatePositionRequest;
import com.hrms.hr_payroll_management_system.dto.response.position.PositionResponse;
import com.hrms.hr_payroll_management_system.service.PositionService;
import com.hrms.hr_payroll_management_system.dto.request.position.AssignPositionOrganizationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('POSITION_CREATE')"
    )
    public ResponseEntity<ApiResponse<PositionResponse>> create(
            @Valid @RequestBody CreatePositionRequest request
    ) {

        PositionResponse position =
                positionService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<PositionResponse>builder()
                                .success(true)
                                .message("Position created successfully.")
                                .data(position)
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('POSITION_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<PositionResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<PositionResponse>>builder()
                        .success(true)
                        .message("Positions retrieved successfully.")
                        .data(positionService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('POSITION_VIEW')"
    )
    public ResponseEntity<ApiResponse<PositionResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<PositionResponse>builder()
                        .success(true)
                        .message("Position retrieved successfully.")
                        .data(positionService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('POSITION_UPDATE')"
    )
    public ResponseEntity<ApiResponse<PositionResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePositionRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<PositionResponse>builder()
                        .success(true)
                        .message("Position updated successfully.")
                        .data(positionService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('POSITION_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        positionService.delete(id);

        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{positionId}/organization")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('POSITION_UPDATE')"
        )
        public ResponseEntity<ApiResponse<PositionResponse>> assignOrganization(
                @PathVariable Long positionId,
                @Valid @RequestBody AssignPositionOrganizationRequest request
        ) {

        PositionResponse position =
                positionService.assignOrganization(
                        positionId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<PositionResponse>builder()
                        .success(true)
                        .message(
                                "Position organization assigned successfully."
                        )
                        .data(position)
                        .build()
        );
        }
        @GetMapping("/company/{companyId}")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('POSITION_VIEW')"
        )
        public ResponseEntity<ApiResponse<List<PositionResponse>>> getByCompany(
                @PathVariable Long companyId
        ) {

        return ResponseEntity.ok(
                ApiResponse.<List<PositionResponse>>builder()
                        .success(true)
                        .message(
                                "Company positions retrieved successfully."
                        )
                        .data(
                                positionService.getByCompanyId(
                                        companyId
                                )
                        )
                        .build()
        );
        }
        @GetMapping("/branch/{branchId}")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('POSITION_VIEW')"
        )
        public ResponseEntity<ApiResponse<List<PositionResponse>>> getByBranch(
                @PathVariable Long branchId
        ) {

        return ResponseEntity.ok(
                ApiResponse.<List<PositionResponse>>builder()
                        .success(true)
                        .message(
                                "Branch positions retrieved successfully."
                        )
                        .data(
                                positionService.getByBranchId(
                                        branchId
                                )
                        )
                        .build()
        );
        }
        @GetMapping("/department/{departmentId}")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('POSITION_VIEW')"
        )
        public ResponseEntity<ApiResponse<List<PositionResponse>>> getByDepartment(
                @PathVariable Long departmentId
        ) {

        return ResponseEntity.ok(
                ApiResponse.<List<PositionResponse>>builder()
                        .success(true)
                        .message(
                                "Department positions retrieved successfully."
                        )
                        .data(
                                positionService.getByDepartmentId(
                                        departmentId
                                )
                        )
                        .build()
        );
        }
}
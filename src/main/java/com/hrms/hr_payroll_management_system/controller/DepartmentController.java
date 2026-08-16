package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.department.AssignDepartmentOrganizationRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.CreateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.UpdateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.response.department.DepartmentResponse;
import com.hrms.hr_payroll_management_system.service.DepartmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DEPARTMENT_CREATE')"
    )
    public ResponseEntity<ApiResponse<DepartmentResponse>> create(
            @Valid @RequestBody CreateDepartmentRequest request
    ) {

        DepartmentResponse department =
                departmentService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<DepartmentResponse>builder()
                                .success(true)
                                .message("Department created successfully.")
                                .data(department)
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DEPARTMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<DepartmentResponse>>builder()
                        .success(true)
                        .message("Departments retrieved successfully.")
                        .data(departmentService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DEPARTMENT_VIEW')"
    )
    public ResponseEntity<ApiResponse<DepartmentResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<DepartmentResponse>builder()
                        .success(true)
                        .message("Department retrieved successfully.")
                        .data(departmentService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DEPARTMENT_UPDATE')"
    )
    public ResponseEntity<ApiResponse<DepartmentResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDepartmentRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<DepartmentResponse>builder()
                        .success(true)
                        .message("Department updated successfully.")
                        .data(departmentService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DEPARTMENT_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        departmentService.delete(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/company/{companyId}")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('DEPARTMENT_VIEW')"
        )
        public ResponseEntity<
                ApiResponse<List<DepartmentResponse>>
                > getByCompanyId(
                @PathVariable Long companyId
        ) {

        return ResponseEntity.ok(
                ApiResponse.<List<DepartmentResponse>>builder()
                        .success(true)
                        .message(
                                "Company departments retrieved successfully."
                        )
                        .data(
                                departmentService.getByCompanyId(
                                        companyId
                                )
                        )
                        .build()
        );
        }
        @GetMapping("/branch/{branchId}")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('DEPARTMENT_VIEW')"
        )
        public ResponseEntity<
                ApiResponse<List<DepartmentResponse>>
                > getByBranchId(
                @PathVariable Long branchId
        ) {

        return ResponseEntity.ok(
                ApiResponse.<List<DepartmentResponse>>builder()
                        .success(true)
                        .message(
                                "Branch departments retrieved successfully."
                        )
                        .data(
                                departmentService.getByBranchId(
                                        branchId
                                )
                        )
                        .build()
        );
        }
        @PutMapping("/{departmentId}/organization")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('DEPARTMENT_UPDATE')"
        )
        public ResponseEntity<
                ApiResponse<DepartmentResponse>
                > assignOrganization(

                @PathVariable Long departmentId,

                @Valid
                @RequestBody
                AssignDepartmentOrganizationRequest request
        ) {

        DepartmentResponse department =
                departmentService.assignOrganization(
                        departmentId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<DepartmentResponse>builder()
                        .success(true)
                        .message(
                                "Department organization assigned successfully."
                        )
                        .data(department)
                        .build()
        );
        }
}
package com.hrms.hr_payroll_management_system.controller.document;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.document.CreateEmployeeDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.request.document.UpdateEmployeeDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.request.document.VerifyDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.response.document.EmployeeDocumentResponse;
import com.hrms.hr_payroll_management_system.service.document.EmployeeDocumentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/employee-documents")
@RequiredArgsConstructor
public class EmployeeDocumentController {

    private final EmployeeDocumentService service;

    @PostMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_CREATE')"
    )
    public ResponseEntity<
            ApiResponse<EmployeeDocumentResponse>
            > create(
            @PathVariable Long employeeId,
            @Valid @RequestBody CreateEmployeeDocumentRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<EmployeeDocumentResponse>builder()
                                .success(true)
                                .message(
                                        "Employee document created successfully."
                                )
                                .data(
                                        service.create(
                                                employeeId,
                                                request
                                        )
                                )
                                .build()
                );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<EmployeeDocumentResponse>
            > getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<EmployeeDocumentResponse>builder()
                        .success(true)
                        .message(
                                "Employee document retrieved successfully."
                        )
                        .data(service.getById(id))
                        .build()
        );
    }

    @GetMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<EmployeeDocumentResponse>>
            > getByEmployee(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<EmployeeDocumentResponse>>builder()
                        .success(true)
                        .message(
                                "Employee documents retrieved successfully."
                        )
                        .data(
                                service.getByEmployee(
                                        employeeId
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_UPDATE')"
    )
    public ResponseEntity<
            ApiResponse<EmployeeDocumentResponse>
            > update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeDocumentRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<EmployeeDocumentResponse>builder()
                        .success(true)
                        .message(
                                "Employee document updated successfully."
                        )
                        .data(
                                service.update(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_VERIFY')"
    )
    public ResponseEntity<
            ApiResponse<EmployeeDocumentResponse>
            > verify(
            @PathVariable Long id,
            @Valid @RequestBody VerifyDocumentRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<EmployeeDocumentResponse>builder()
                        .success(true)
                        .message(
                                "Document verification completed."
                        )
                        .data(
                                service.verify(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @GetMapping("/expiring")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<EmployeeDocumentResponse>>
            > expiring(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<EmployeeDocumentResponse>>builder()
                        .success(true)
                        .message(
                                "Expiring documents retrieved successfully."
                        )
                        .data(
                                service.getExpiring(
                                        startDate,
                                        endDate
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/mark-expired")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_MANAGE')"
    )
    public ResponseEntity<ApiResponse<Integer>> markExpired() {

        int count =
                service.markExpiredDocuments();

        return ResponseEntity.ok(
                ApiResponse
                        .<Integer>builder()
                        .success(true)
                        .message(
                                "Expired documents updated successfully."
                        )
                        .data(count)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}
package com.hrms.hr_payroll_management_system.controller.document;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.document.CreateDocumentTypeRequest;
import com.hrms.hr_payroll_management_system.dto.response.document.DocumentTypeResponse;
import com.hrms.hr_payroll_management_system.service.document.DocumentTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/document-types")
@RequiredArgsConstructor
public class DocumentTypeController {

    private final DocumentTypeService service;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_MANAGE')"
    )
    public ResponseEntity<
            ApiResponse<DocumentTypeResponse>
            > create(
            @Valid @RequestBody CreateDocumentTypeRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<DocumentTypeResponse>builder()
                                .success(true)
                                .message(
                                        "Document type created successfully."
                                )
                                .data(service.create(request))
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<DocumentTypeResponse>>
            > getAll() {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<DocumentTypeResponse>>builder()
                        .success(true)
                        .message(
                                "Document types retrieved successfully."
                        )
                        .data(service.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<DocumentTypeResponse>
            > getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<DocumentTypeResponse>builder()
                        .success(true)
                        .message(
                                "Document type retrieved successfully."
                        )
                        .data(service.getById(id))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('DOCUMENT_MANAGE')"
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
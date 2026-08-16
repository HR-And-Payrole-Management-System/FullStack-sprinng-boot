package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.company.CreateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.request.company.UpdateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.response.company.CompanyResponse;
import com.hrms.hr_payroll_management_system.service.CompanyService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('COMPANY_CREATE')"
    )
    public ResponseEntity<ApiResponse<CompanyResponse>> create(
            @Valid @RequestBody CreateCompanyRequest request
    ) {

        CompanyResponse company =
                companyService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<CompanyResponse>builder()
                                .success(true)
                                .message(
                                        "Company created successfully."
                                )
                                .data(company)
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('COMPANY_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<CompanyResponse>>builder()
                        .success(true)
                        .message(
                                "Companies retrieved successfully."
                        )
                        .data(companyService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('COMPANY_VIEW')"
    )
    public ResponseEntity<ApiResponse<CompanyResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<CompanyResponse>builder()
                        .success(true)
                        .message(
                                "Company retrieved successfully."
                        )
                        .data(companyService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('COMPANY_UPDATE')"
    )
    public ResponseEntity<ApiResponse<CompanyResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCompanyRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<CompanyResponse>builder()
                        .success(true)
                        .message(
                                "Company updated successfully."
                        )
                        .data(
                                companyService.update(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('COMPANY_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        companyService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.location.CreateLocationRequest;
import com.hrms.hr_payroll_management_system.dto.request.location.UpdateLocationRequest;
import com.hrms.hr_payroll_management_system.dto.response.location.LocationResponse;
import com.hrms.hr_payroll_management_system.service.LocationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LOCATION_CREATE')"
    )
    public ResponseEntity<ApiResponse<LocationResponse>> create(
            @Valid @RequestBody CreateLocationRequest request
    ) {

        LocationResponse location = locationService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<LocationResponse>builder()
                                .success(true)
                                .message("Location created successfully.")
                                .data(location)
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LOCATION_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<LocationResponse>>builder()
                        .success(true)
                        .message("Locations retrieved successfully.")
                        .data(locationService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LOCATION_VIEW')"
    )
    public ResponseEntity<ApiResponse<LocationResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LocationResponse>builder()
                        .success(true)
                        .message("Location retrieved successfully.")
                        .data(locationService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LOCATION_UPDATE')"
    )
    public ResponseEntity<ApiResponse<LocationResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLocationRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LocationResponse>builder()
                        .success(true)
                        .message("Location updated successfully.")
                        .data(locationService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LOCATION_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        locationService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('LOCATION_VIEW')"
    )
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getByBranch(
            @PathVariable Long branchId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<LocationResponse>>builder()
                        .success(true)
                        .message("Branch locations retrieved successfully.")
                        .data(locationService.getByBranchId(branchId))
                        .build()
        );
    }
}
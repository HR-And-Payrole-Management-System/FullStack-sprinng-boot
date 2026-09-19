package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.announcement.CreateAnnouncementRequest;
import com.hrms.hr_payroll_management_system.dto.response.announcement.AnnouncementResponse;
import com.hrms.hr_payroll_management_system.service.AnnouncementService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> create(
            @Valid @RequestBody CreateAnnouncementRequest request,
            Authentication authentication
    ) {
        AnnouncementResponse response = announcementService.create(request, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AnnouncementResponse>builder()
                        .success(true)
                        .message("Announcement posted successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.<List<AnnouncementResponse>>builder()
                        .success(true)
                        .message("Announcements retrieved successfully.")
                        .data(announcementService.getAll())
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        announcementService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
package com.hrms.hr_payroll_management_system.controller.notification;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;

import com.hrms.hr_payroll_management_system.dto.request.notification.CreateNotificationRequest;
import com.hrms.hr_payroll_management_system.dto.response.notification.NotificationResponse;

import com.hrms.hr_payroll_management_system.service.notification.NotificationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('NOTIFICATION_CREATE')"
    )
    public ResponseEntity<
            ApiResponse<NotificationResponse>
            > create(
            @Valid
            @RequestBody
            CreateNotificationRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<NotificationResponse>builder()
                                .success(true)
                                .message(
                                        "Notification created successfully."
                                )
                                .data(
                                        service.create(request)
                                )
                                .build()
                );
    }

    @GetMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('NOTIFICATION_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<NotificationResponse>>
            > getEmployeeNotifications(

            @PathVariable
            Long employeeId,

            @RequestParam(
                    defaultValue = "false"
            )
            boolean unreadOnly
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<NotificationResponse>>builder()
                        .success(true)
                        .message(
                                "Notifications retrieved successfully."
                        )
                        .data(
                                service
                                        .getEmployeeNotifications(
                                                employeeId,
                                                unreadOnly
                                        )
                        )
                        .build()
        );
    }

    @GetMapping(
            "/employees/{employeeId}/unread-count"
    )
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('NOTIFICATION_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<Long>
            > unreadCount(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<Long>builder()
                        .success(true)
                        .message(
                                "Unread notification count retrieved."
                        )
                        .data(
                                service.countUnread(
                                        employeeId
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/{id}/read")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('NOTIFICATION_UPDATE')"
    )
    public ResponseEntity<
            ApiResponse<NotificationResponse>
            > markRead(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<NotificationResponse>builder()
                        .success(true)
                        .message(
                                "Notification marked as read."
                        )
                        .data(
                                service.markAsRead(id)
                        )
                        .build()
        );
    }

    @PutMapping(
            "/employees/{employeeId}/read-all"
    )
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('NOTIFICATION_UPDATE')"
    )
    public ResponseEntity<
            ApiResponse<Void>
            > markAllRead(
            @PathVariable Long employeeId
    ) {

        service.markAllAsRead(
                employeeId
        );

        return ResponseEntity.ok(
                ApiResponse
                        .<Void>builder()
                        .success(true)
                        .message(
                                "All notifications marked as read."
                        )
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('NOTIFICATION_DELETE')"
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
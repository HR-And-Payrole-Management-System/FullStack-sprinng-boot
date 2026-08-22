package com.hrms.hr_payroll_management_system.service.notification;

import com.hrms.hr_payroll_management_system.dto.request.notification.CreateNotificationRequest;
import com.hrms.hr_payroll_management_system.dto.response.notification.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse create(
            CreateNotificationRequest request
    );

    List<NotificationResponse> getEmployeeNotifications(
            Long employeeId,
            boolean unreadOnly
    );

    long countUnread(Long employeeId);

    NotificationResponse markAsRead(
            Long id
    );

    void markAllAsRead(
            Long employeeId
    );

    void delete(Long id);
}
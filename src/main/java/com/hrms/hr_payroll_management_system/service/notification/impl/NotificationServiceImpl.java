package com.hrms.hr_payroll_management_system.service.notification.impl;

import com.hrms.hr_payroll_management_system.dto.request.notification.CreateNotificationRequest;
import com.hrms.hr_payroll_management_system.dto.response.notification.NotificationResponse;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.notification.Notification;

import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;

import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.notification.NotificationRepository;

import com.hrms.hr_payroll_management_system.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final EmployeeRepository employeeRepository;

    @Override
    public NotificationResponse create(
            CreateNotificationRequest request
    ) {

        Employee employee =
                getEmployee(
                        request.getEmployeeId()
                );

        Notification notification =
                Notification.builder()
                        .employee(employee)
                        .type(request.getType())
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .read(false)
                        .referenceType(
                                request.getReferenceType()
                        )
                        .referenceId(
                                request.getReferenceId()
                        )
                        .build();

        return map(
                notificationRepository.save(
                        notification
                )
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse>
    getEmployeeNotifications(
            Long employeeId,
            boolean unreadOnly
    ) {

        getEmployee(employeeId);

        List<Notification> notifications;

        if (unreadOnly) {

            notifications =
                    notificationRepository
                            .findByEmployeeIdAndReadFalseOrderByCreatedAtDesc(
                                    employeeId
                            );

        } else {

            notifications =
                    notificationRepository
                            .findByEmployeeIdOrderByCreatedAtDesc(
                                    employeeId
                            );
        }

        return notifications
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnread(
            Long employeeId
    ) {

        getEmployee(employeeId);

        return notificationRepository
                .countByEmployeeIdAndReadFalse(
                        employeeId
                );
    }

    @Override
    public NotificationResponse markAsRead(
            Long id
    ) {

        Notification notification =
                getNotification(id);

        notification.setRead(true);

        return map(
                notificationRepository.save(
                        notification
                )
        );
    }

    @Override
    public void markAllAsRead(
            Long employeeId
    ) {

        getEmployee(employeeId);

        List<Notification> notifications =
                notificationRepository
                        .findByEmployeeIdAndReadFalseOrderByCreatedAtDesc(
                                employeeId
                        );

        notifications.forEach(
                notification ->
                        notification.setRead(true)
        );

        notificationRepository.saveAll(
                notifications
        );
    }

    @Override
    public void delete(Long id) {

        notificationRepository.delete(
                getNotification(id)
        );
    }

    private Notification getNotification(
            Long id
    ) {

        return notificationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found."
                        )
                );
    }

    private Employee getEmployee(
            Long id
    ) {

        return employeeRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found."
                        )
                );
    }

    private NotificationResponse map(
            Notification notification
    ) {

        Employee employee =
                notification.getEmployee();

        return NotificationResponse.builder()
                .id(notification.getId())
                .employeeId(employee.getId())
                .employeeCode(
                        employee.getEmployeeCode()
                )
                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )
                .type(
                        notification
                                .getType()
                                .name()
                )
                .title(
                        notification.getTitle()
                )
                .message(
                        notification.getMessage()
                )
                .read(
                        notification.getRead()
                )
                .referenceType(
                        notification.getReferenceType()
                )
                .referenceId(
                        notification.getReferenceId()
                )
                .createdAt(
                        notification.getCreatedAt()
                )
                .build();
    }
}
package com.hrms.hr_payroll_management_system.repository.notification;

import com.hrms.hr_payroll_management_system.entity.notification.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
    findByEmployeeIdOrderByCreatedAtDesc(
            Long employeeId
    );

    List<Notification>
    findByEmployeeIdAndReadFalseOrderByCreatedAtDesc(
            Long employeeId
    );

    long countByEmployeeIdAndReadFalse(
            Long employeeId
    );
}
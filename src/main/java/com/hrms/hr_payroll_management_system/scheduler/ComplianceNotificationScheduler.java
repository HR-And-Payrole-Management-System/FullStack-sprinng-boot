package com.hrms.hr_payroll_management_system.scheduler;

import com.hrms.hr_payroll_management_system.dto.request.notification.CreateNotificationRequest;
import com.hrms.hr_payroll_management_system.dto.response.compliance.ComplianceRequirementResponse;
import com.hrms.hr_payroll_management_system.dto.response.compliance.EmployeeComplianceResponse;
import com.hrms.hr_payroll_management_system.enums.NotificationType;
import com.hrms.hr_payroll_management_system.service.compliance.ComplianceService;
import com.hrms.hr_payroll_management_system.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ComplianceNotificationScheduler {

    private final ComplianceService complianceService;
    private final NotificationService notificationService;

    // Runs daily, same slot family as the existing document scheduler.
    @Scheduled(cron = "0 40 6 * * *")
    public void notifyComplianceIssues() {
        int notified = 0;

        for (ComplianceRequirementResponse requirement : complianceService.getAll()) {
            for (EmployeeComplianceResponse e : requirement.getEmployees()) {
                if ("COMPLIANT".equals(e.getStatus())) continue;

                CreateNotificationRequest notification = new CreateNotificationRequest();
                notification.setEmployeeId(e.getEmployeeId());
                notification.setType(NotificationType.GENERAL);
                notification.setTitle("Compliance: " + requirement.getName());
                notification.setMessage(e.getStatus().equals("AT_RISK")
                        ? requirement.getName() + " — " + e.getDetail()
                        : requirement.getName() + " — action required: " + e.getDetail());
                notification.setReferenceType("ComplianceRequirement");
                notification.setReferenceId(requirement.getId());

                notificationService.create(notification);
                notified++;
            }
        }

        log.info("Scheduled job: sent {} compliance notification(s).", notified);
    }
}
package com.hrms.hr_payroll_management_system.scheduler;

import com.hrms.hr_payroll_management_system.dto.request.notification.CreateNotificationRequest;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.survey.Survey;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.NotificationType;
import com.hrms.hr_payroll_management_system.enums.SurveyStatus;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.survey.SurveyRepository;
import com.hrms.hr_payroll_management_system.repository.survey.SurveyResponseRepository;
import com.hrms.hr_payroll_management_system.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class SurveyReminderScheduler {

    private final SurveyRepository surveyRepository;
    private final SurveyResponseRepository responseRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;

    // 3 days before close, once daily.
    @Scheduled(cron = "0 30 7 * * *")
    public void remindNonRespondents() {
        int remindersSent = 0;

        for (Survey survey : surveyRepository.findAll()) {
            if (survey.getStatus() != SurveyStatus.ACTIVE || survey.getClosesAt() == null) continue;

            long daysUntilClose = LocalDate.now().until(survey.getClosesAt()).getDays();
            if (daysUntilClose != 3) continue; // only fire on the exact 3-day mark, not every day after

            Set<Long> respondedIds = responseRepository.findBySurveyId(survey.getId()).stream()
                    .map(r -> r.getEmployee().getId())
                    .collect(Collectors.toSet());

            List<Employee> scoped = employeeRepository.findByStatus(EmployeeStatus.ACTIVE).stream()
                    .filter(e -> survey.getDepartment() == null
                            || (e.getDepartment() != null && e.getDepartment().getId().equals(survey.getDepartment().getId())))
                    .filter(e -> !respondedIds.contains(e.getId()))
                    .toList();

            for (Employee e : scoped) {
                CreateNotificationRequest notification = new CreateNotificationRequest();
                notification.setEmployeeId(e.getId());
                notification.setType(NotificationType.GENERAL);
                notification.setTitle("Survey closing soon: " + survey.getTitle());
                notification.setMessage("This survey closes on " + survey.getClosesAt() + " — please submit your response.");
                notification.setReferenceType("Survey");
                notification.setReferenceId(survey.getId());
                notificationService.create(notification);
                remindersSent++;
            }
        }

        log.info("Scheduled job: sent {} survey reminder(s).", remindersSent);
    }
}
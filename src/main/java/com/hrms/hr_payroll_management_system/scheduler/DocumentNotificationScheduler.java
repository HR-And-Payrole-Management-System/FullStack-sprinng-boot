package com.hrms.hr_payroll_management_system.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hrms.hr_payroll_management_system.service.document.EmployeeDocumentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component 
@RequiredArgsConstructor 
@Slf4j 
public class DocumentNotificationScheduler {
    private final EmployeeDocumentService employeeDocumentService;

    @Scheduled(cron = "0 0 6 * * *")
    public void checkExpiredDocuments(){
        int count = employeeDocumentService.markExpiredDocuments();
        log.info("Scheduled job: marked {} document(s) as expired.", count);

    }
    @Scheduled(cron = "0 20 6 * * *")
    public void  checkExpiringSoonDocuments(){
        int count = employeeDocumentService.markExpiringSoon(7);
        log.info("Scheduled job: sent {} document(s) expiring-soon notification.", count);
    }
    
}

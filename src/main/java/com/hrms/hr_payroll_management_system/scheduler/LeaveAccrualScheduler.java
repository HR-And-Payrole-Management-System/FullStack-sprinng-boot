package com.hrms.hr_payroll_management_system.scheduler;

import com.hrms.hr_payroll_management_system.service.LeaveService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

// Runs once a year and credits every active employee with a fresh
// leave balance (per active leave type) for the new year. Before
// this existed, a balance was only ever created lazily the first
// time an employee happened to request leave — meaning an employee
// who never requested leave had no balance row at all, and nothing
// ever rolled the allocation over into a new year automatically.
@Component
@RequiredArgsConstructor
@Slf4j
public class LeaveAccrualScheduler {

    private final LeaveService leaveService;

    // 00:30 on Jan 1st every year.
    @Scheduled(cron = "0 30 0 1 1 *")
    public void accrueForNewYear() {

        int year = LocalDate.now().getYear();

        int created = leaveService.accrueYearlyBalances(year);

        log.info(
                "Scheduled job: accrued {} leave balance row(s) for {}.",
                created,
                year
        );
    }
}
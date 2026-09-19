package com.hrms.hr_payroll_management_system.scheduler;

import com.hrms.hr_payroll_management_system.service.payroll.PayrollService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

// Runs on the 1st of every month and generates payroll for every
// active employee for the month that just ended. Before this
// existed, PayrollService.generate() only ever ran when someone
// manually POSTed /api/v1/payrolls/generate for one employee at a
// time — nothing produced payroll automatically at month-end.
//
// Payroll still requires human review: this only creates the
// records (status DRAFT/PENDING, depending on PayrollServiceImpl),
// it does not approve or mark them paid — that stays a manual step
// via PAYROLL_APPROVE / PAYROLL_PAY, same as today.
@Component
@RequiredArgsConstructor
@Slf4j
public class PayrollGenerationScheduler {

    private final PayrollService payrollService;

    // 02:00 on the 1st of every month.
    @Scheduled(cron = "0 0 2 1 * *")
    public void generateForPreviousMonth() {

        LocalDate previousMonth = LocalDate.now().minusMonths(1);

        int created =
                payrollService.generateForAllActiveEmployees(
                        previousMonth.getYear(),
                        previousMonth.getMonthValue()
                );

        log.info(
                "Scheduled job: generated {} payroll record(s) for {}/{}.",
                created,
                previousMonth.getYear(),
                previousMonth.getMonthValue()
        );
    }
}
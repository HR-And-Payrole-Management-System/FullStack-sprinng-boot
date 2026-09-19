package com.hrms.hr_payroll_management_system.config;

import com.hrms.hr_payroll_management_system.entity.Invoice;
import com.hrms.hr_payroll_management_system.enums.InvoiceStatus;
import com.hrms.hr_payroll_management_system.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Order(3)
@RequiredArgsConstructor
public class BillingSeeder implements ApplicationRunner {

    private final InvoiceRepository invoiceRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedInvoice("INV-SEED-0001", "Professional", new BigDecimal("79"), LocalDate.now().minusMonths(2));
        seedInvoice("INV-SEED-0002", "Professional", new BigDecimal("79"), LocalDate.now().minusMonths(1));
    }

    private void seedInvoice(String number, String plan, BigDecimal amount, LocalDate date) {
        if (invoiceRepository.existsByInvoiceNumber(number)) return;
        invoiceRepository.save(
                Invoice.builder()
                        .invoiceNumber(number)
                        .planName(plan)
                        .amount(amount)
                        .status(InvoiceStatus.PAID)
                        .issuedDate(date)
                        .paidDate(date)
                        .build()
        );
    }
}
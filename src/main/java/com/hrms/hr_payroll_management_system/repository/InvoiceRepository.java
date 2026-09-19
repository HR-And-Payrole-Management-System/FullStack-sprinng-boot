package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findAllByOrderByIssuedDateDesc();
    boolean existsByInvoiceNumber(String invoiceNumber);
}
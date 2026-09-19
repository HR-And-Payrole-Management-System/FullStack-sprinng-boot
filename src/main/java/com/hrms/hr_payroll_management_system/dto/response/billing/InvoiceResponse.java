package com.hrms.hr_payroll_management_system.dto.response.billing;

import com.hrms.hr_payroll_management_system.enums.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private String planName;
    private BigDecimal amount;
    private InvoiceStatus status;
    private LocalDate issuedDate;
    private LocalDate paidDate;
}
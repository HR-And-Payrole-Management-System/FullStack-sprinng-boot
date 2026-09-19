package com.hrms.hr_payroll_management_system.dto.response.billing;

import com.hrms.hr_payroll_management_system.enums.BillingCycle;
import com.hrms.hr_payroll_management_system.enums.SubscriptionStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SubscriptionResponse {
    private Long id;
    private String planKey;
    private String planName;
    private BigDecimal price;
    private BillingCycle billingCycle;
    private SubscriptionStatus status;
    private Integer employeeLimit;
    private LocalDate startDate;
    private LocalDate nextBillingDate;
    private String cardBrand;
    private String cardLast4;
    private Boolean autoRenew;
}
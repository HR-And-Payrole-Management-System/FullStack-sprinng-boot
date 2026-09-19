package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.response.billing.InvoiceResponse;
import com.hrms.hr_payroll_management_system.dto.response.billing.SubscriptionResponse;
import com.hrms.hr_payroll_management_system.entity.Invoice;
import com.hrms.hr_payroll_management_system.entity.Subscription;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BillingMapper {
    SubscriptionResponse toResponse(Subscription subscription);
    InvoiceResponse toResponse(Invoice invoice);
}
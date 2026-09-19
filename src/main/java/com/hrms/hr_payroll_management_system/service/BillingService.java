package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.billing.ChangePlanRequest;
import com.hrms.hr_payroll_management_system.dto.response.billing.*;

import java.util.List;

public interface BillingService {
    SubscriptionResponse getSubscription();
    List<PlanResponse> getPlans();
    SubscriptionResponse changePlan(ChangePlanRequest request);
    SubscriptionResponse cancelSubscription();
    List<InvoiceResponse> getInvoices();
    BillingSummaryResponse getSummary();
}
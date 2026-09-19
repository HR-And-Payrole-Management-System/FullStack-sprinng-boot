package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.billing.ChangePlanRequest;
import com.hrms.hr_payroll_management_system.dto.response.billing.*;
import com.hrms.hr_payroll_management_system.service.BillingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @GetMapping("/subscription")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('BILLING_VIEW')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> getSubscription() {
        return ResponseEntity.ok(ApiResponse.<SubscriptionResponse>builder()
                .success(true).message("Subscription retrieved successfully.")
                .data(billingService.getSubscription()).build());
    }

    @GetMapping("/plans")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('BILLING_VIEW')")
    public ResponseEntity<ApiResponse<List<PlanResponse>>> getPlans() {
        return ResponseEntity.ok(ApiResponse.<List<PlanResponse>>builder()
                .success(true).message("Plans retrieved successfully.")
                .data(billingService.getPlans()).build());
    }

    @PostMapping("/change-plan")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('BILLING_MANAGE')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> changePlan(
            @Valid @RequestBody ChangePlanRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.<SubscriptionResponse>builder()
                .success(true).message("Plan changed successfully.")
                .data(billingService.changePlan(request)).build());
    }

    @PostMapping("/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('BILLING_MANAGE')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> cancel() {
        return ResponseEntity.ok(ApiResponse.<SubscriptionResponse>builder()
                .success(true).message("Subscription canceled.")
                .data(billingService.cancelSubscription()).build());
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('BILLING_VIEW')")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoices() {
        return ResponseEntity.ok(ApiResponse.<List<InvoiceResponse>>builder()
                .success(true).message("Invoices retrieved successfully.")
                .data(billingService.getInvoices()).build());
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('BILLING_VIEW')")
    public ResponseEntity<ApiResponse<BillingSummaryResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.<BillingSummaryResponse>builder()
                .success(true).message("Billing summary retrieved successfully.")
                .data(billingService.getSummary()).build());
    }
}
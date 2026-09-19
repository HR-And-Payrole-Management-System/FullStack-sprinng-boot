package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.billing.ChangePlanRequest;
import com.hrms.hr_payroll_management_system.dto.response.billing.*;
import com.hrms.hr_payroll_management_system.entity.Invoice;
import com.hrms.hr_payroll_management_system.entity.Subscription;
import com.hrms.hr_payroll_management_system.enums.BillingCycle;
import com.hrms.hr_payroll_management_system.enums.InvoiceStatus;
import com.hrms.hr_payroll_management_system.enums.SubscriptionStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.BillingMapper;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.InvoiceRepository;
import com.hrms.hr_payroll_management_system.repository.SubscriptionRepository;
import com.hrms.hr_payroll_management_system.service.BillingService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class BillingServiceImpl implements BillingService {

    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final EmployeeRepository employeeRepository;
    private final BillingMapper billingMapper;

    private static final Map<String, PlanResponse> PLAN_CATALOG = Map.of(
            "FREE", PlanResponse.builder()
                    .planKey("FREE").planName("Free")
                    .monthlyPrice(BigDecimal.ZERO).employeeLimit(10)
                    .features(List.of("Up to 10 employees", "Basic attendance & leave", "Community support"))
                    .highlighted(false).build(),
            "STARTER", PlanResponse.builder()
                    .planKey("STARTER").planName("Starter")
                    .monthlyPrice(new BigDecimal("29")).employeeLimit(50)
                    .features(List.of("Up to 50 employees", "Payroll & payslips", "Email support"))
                    .highlighted(false).build(),
            "PROFESSIONAL", PlanResponse.builder()
                    .planKey("PROFESSIONAL").planName("Professional")
                    .monthlyPrice(new BigDecimal("79")).employeeLimit(200)
                    .features(List.of("Up to 200 employees", "Advanced analytics", "Recruitment module", "Priority support"))
                    .highlighted(true).build(),
            "ENTERPRISE", PlanResponse.builder()
                    .planKey("ENTERPRISE").planName("Enterprise")
                    .monthlyPrice(new BigDecimal("199")).employeeLimit(Integer.MAX_VALUE)
                    .features(List.of("Unlimited employees", "Custom integrations", "Dedicated account manager", "SLA support"))
                    .highlighted(false).build()
    );

    @Override
    
    public SubscriptionResponse getSubscription() {
        return billingMapper.toResponse(getOrCreateSubscription());
    }

    @Override
    public List<PlanResponse> getPlans() {
        return List.of(PLAN_CATALOG.get("FREE"), PLAN_CATALOG.get("STARTER"),
                PLAN_CATALOG.get("PROFESSIONAL"), PLAN_CATALOG.get("ENTERPRISE"));
    }

    @Override
    public SubscriptionResponse changePlan(ChangePlanRequest request) {
        PlanResponse plan = PLAN_CATALOG.get(request.getPlanKey());
        if (plan == null) {
            throw new BadRequestException("Unknown plan: " + request.getPlanKey());
        }

        long employeeCount = employeeRepository.count();
        if (plan.getEmployeeLimit() != Integer.MAX_VALUE && employeeCount > plan.getEmployeeLimit()) {
            throw new BadRequestException(
                    "Cannot downgrade — you currently have " + employeeCount +
                    " employees, which exceeds the " + plan.getEmployeeLimit() + " limit for " + plan.getPlanName() + "."
            );
        }

        Subscription subscription = getOrCreateSubscription();
        subscription.setPlanKey(plan.getPlanKey());
        subscription.setPlanName(plan.getPlanName());
        subscription.setPrice(plan.getMonthlyPrice());
        subscription.setBillingCycle(BillingCycle.MONTHLY);
        subscription.setEmployeeLimit(plan.getEmployeeLimit());
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStartDate(LocalDate.now());
        subscription.setNextBillingDate(LocalDate.now().plusMonths(1));

        Subscription saved = subscriptionRepository.save(subscription);

        if (plan.getMonthlyPrice().compareTo(BigDecimal.ZERO) > 0) {
            createInvoice(saved);
        }

        return billingMapper.toResponse(saved);
    }

    @Override
    public SubscriptionResponse cancelSubscription() {
        Subscription subscription = getOrCreateSubscription();
        subscription.setStatus(SubscriptionStatus.CANCELED);
        subscription.setAutoRenew(false);
        return billingMapper.toResponse(subscriptionRepository.save(subscription));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoices() {
        return invoiceRepository.findAllByOrderByIssuedDateDesc()
                .stream()
                .map(billingMapper::toResponse)
                .toList();
    }

    @Override
    
    public BillingSummaryResponse getSummary() {
        Subscription subscription = getOrCreateSubscription();
        long employeesUsed = employeeRepository.count();

        BigDecimal totalSpent = invoiceRepository.findAllByOrderByIssuedDateDesc()
                .stream()
                .filter(inv -> inv.getStatus() == InvoiceStatus.PAID)
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return BillingSummaryResponse.builder()
                .currentPlanName(subscription.getPlanName())
                .employeesUsed(employeesUsed)
                .employeeLimit(subscription.getEmployeeLimit())
                .nextBillingDate(subscription.getNextBillingDate() == null ? "—" :
                        subscription.getNextBillingDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")))
                .totalSpent(totalSpent)
                .build();
    }

    private Subscription getOrCreateSubscription() {
        return subscriptionRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> subscriptionRepository.save(
                        Subscription.builder()
                                .planKey("FREE").planName("Free")
                                .price(BigDecimal.ZERO)
                                .billingCycle(BillingCycle.MONTHLY)
                                .status(SubscriptionStatus.ACTIVE)
                                .employeeLimit(10)
                                .startDate(LocalDate.now())
                                .autoRenew(true)
                                .build()
                ));
    }

    private void createInvoice(Subscription subscription) {
        String number = "INV-" + System.currentTimeMillis();
        invoiceRepository.save(
                Invoice.builder()
                        .invoiceNumber(number)
                        .planName(subscription.getPlanName())
                        .amount(subscription.getPrice())
                        .status(InvoiceStatus.PAID)
                        .issuedDate(LocalDate.now())
                        .paidDate(LocalDate.now())
                        .build()
        );
    }
}
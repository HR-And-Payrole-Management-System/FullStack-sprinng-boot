package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.expense.RejectExpenseRequest;
import com.hrms.hr_payroll_management_system.dto.request.expense.SubmitExpenseRequest;
import com.hrms.hr_payroll_management_system.dto.response.expense.ExpenseClaimResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.ExpenseClaim;
import com.hrms.hr_payroll_management_system.entity.payroll.PayrollAdjustment;
import com.hrms.hr_payroll_management_system.enums.AdjustmentType;
import com.hrms.hr_payroll_management_system.enums.ExpenseCategory;
import com.hrms.hr_payroll_management_system.enums.ExpenseStatus;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.ExpenseClaimRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.PayrollAdjustmentRepository;
import com.hrms.hr_payroll_management_system.service.ExpenseService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseClaimRepository expenseClaimRepository;
    private final EmployeeRepository employeeRepository;
    private final PayrollAdjustmentRepository payrollAdjustmentRepository;

    // Simple, centralized monthly caps per category — a real system would
    // load this from a settings table, but keeping it explicit here makes
    // the policy visible and a one-line change per category.
    private static final Map<ExpenseCategory, BigDecimal> MONTHLY_LIMITS = new EnumMap<>(ExpenseCategory.class);
    static {
        MONTHLY_LIMITS.put(ExpenseCategory.TRAVEL, new BigDecimal("500"));
        MONTHLY_LIMITS.put(ExpenseCategory.MEALS, new BigDecimal("150"));
        MONTHLY_LIMITS.put(ExpenseCategory.ACCOMMODATION, new BigDecimal("800"));
        MONTHLY_LIMITS.put(ExpenseCategory.OFFICE_SUPPLIES, new BigDecimal("100"));
        MONTHLY_LIMITS.put(ExpenseCategory.TRANSPORT, new BigDecimal("200"));
        MONTHLY_LIMITS.put(ExpenseCategory.OTHER, new BigDecimal("100"));
    }

    @Override
    @Transactional
    public ExpenseClaimResponse submit(SubmitExpenseRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        ExpenseClaim claim = ExpenseClaim.builder()
                .employee(employee)
                .category(request.getCategory())
                .amount(request.getAmount())
                .description(request.getDescription())
                .expenseDate(request.getExpenseDate())
                .receiptUrl(request.getReceiptUrl())
                .status(ExpenseStatus.SUBMITTED)
                .build();

        return toResponse(expenseClaimRepository.save(claim));
    }

    @Override
    @Transactional
    public ExpenseClaimResponse approve(Long claimId, Long approvedByEmployeeId) {
        ExpenseClaim claim = findClaim(claimId);

        if (claim.getStatus() != ExpenseStatus.SUBMITTED) {
            throw new IllegalStateException("Only submitted claims can be approved.");
        }

        claim.setStatus(ExpenseStatus.APPROVED);
        claim.setApprovedAt(LocalDateTime.now());
        if (approvedByEmployeeId != null) {
            employeeRepository.findById(approvedByEmployeeId).ifPresent(claim::setApprovedBy);
        }

        // The cascade: approval mints a real payroll allowance line, dated
        // to the expense's own month, so it lands on the correct payslip
        // automatically — no manual re-entry by payroll staff.
        PayrollAdjustment adjustment = PayrollAdjustment.builder()
                .employee(claim.getEmployee())
                .type(AdjustmentType.ALLOWANCE)
                .name("Expense reimbursement: " + claim.getCategory().name())
                .amount(claim.getAmount())
                .effectiveDate(claim.getExpenseDate())
                .build();
        PayrollAdjustment savedAdjustment = payrollAdjustmentRepository.save(adjustment);

        claim.setPayrollAdjustment(savedAdjustment);
        claim.setStatus(ExpenseStatus.REIMBURSED);

        return toResponse(expenseClaimRepository.save(claim));
    }

    @Override
    @Transactional
    public ExpenseClaimResponse reject(Long claimId, RejectExpenseRequest request) {
        ExpenseClaim claim = findClaim(claimId);
        if (claim.getStatus() != ExpenseStatus.SUBMITTED) {
            throw new IllegalStateException("Only submitted claims can be rejected.");
        }
        claim.setStatus(ExpenseStatus.REJECTED);
        claim.setRejectionReason(request.getReason());
        return toResponse(expenseClaimRepository.save(claim));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseClaimResponse> getPending() {
        return expenseClaimRepository.findByStatus(ExpenseStatus.SUBMITTED).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseClaimResponse> getByEmployee(Long employeeId) {
        return expenseClaimRepository.findByEmployeeId(employeeId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ExpenseClaim findClaim(Long id) {
        return expenseClaimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense claim not found: " + id));
    }

    /** Sums this employee's already-approved/reimbursed spend in this
     *  category for the claim's month, and flags it if THIS claim would
     *  push them over the monthly cap — the actual "enterprise policy"
     *  logic the approver needs to see before clicking Approve. */
    private ExpenseClaimResponse toResponse(ExpenseClaim c) {
        YearMonth month = YearMonth.from(c.getExpenseDate());
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        BigDecimal monthToDate = expenseClaimRepository
                .findByEmployeeIdAndCategoryAndStatusInAndExpenseDateBetween(
                        c.getEmployee().getId(), c.getCategory(),
                        List.of(ExpenseStatus.APPROVED, ExpenseStatus.REIMBURSED),
                        start, end
                ).stream()
                .map(ExpenseClaim::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal limit = MONTHLY_LIMITS.getOrDefault(c.getCategory(), BigDecimal.ZERO);
        boolean overLimit = monthToDate.add(c.getAmount()).compareTo(limit) > 0
                && c.getStatus() == ExpenseStatus.SUBMITTED; // only meaningful pre-approval

        return ExpenseClaimResponse.builder()
                .id(c.getId())
                .employeeId(c.getEmployee().getId())
                .employeeName(c.getEmployee().getFirstName() + " " + c.getEmployee().getLastName())
                .category(c.getCategory().name())
                .amount(c.getAmount())
                .description(c.getDescription())
                .expenseDate(c.getExpenseDate())
                .receiptUrl(c.getReceiptUrl())
                .status(c.getStatus().name())
                .approvedByName(c.getApprovedBy() != null
                        ? c.getApprovedBy().getFirstName() + " " + c.getApprovedBy().getLastName() : null)
                .rejectionReason(c.getRejectionReason())
                .overMonthlyLimit(overLimit)
                .monthlyLimitForCategory(limit)
                .monthToDateTotalForCategory(monthToDate)
                .build();
    }
}
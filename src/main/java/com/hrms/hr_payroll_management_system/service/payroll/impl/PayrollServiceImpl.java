package com.hrms.hr_payroll_management_system.service.payroll.impl;

import com.hrms.hr_payroll_management_system.dto.request.payroll.GeneratePayrollRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.PayrollResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.payroll.BenefitRule;
import com.hrms.hr_payroll_management_system.entity.payroll.EmployeeSalary;
import com.hrms.hr_payroll_management_system.entity.payroll.Payroll;
import com.hrms.hr_payroll_management_system.entity.payroll.PayrollAdjustment;
import com.hrms.hr_payroll_management_system.entity.payroll.SalaryStructure;
import com.hrms.hr_payroll_management_system.enums.AdjustmentType;
import com.hrms.hr_payroll_management_system.enums.BenefitType;
import com.hrms.hr_payroll_management_system.enums.PayrollStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.BenefitRuleRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.EmployeeSalaryRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.PayrollAdjustmentRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.PayrollRepository;
import com.hrms.hr_payroll_management_system.service.audit.AuditLogService;
import com.hrms.hr_payroll_management_system.service.payroll.PayrollCalculationService;
import com.hrms.hr_payroll_management_system.service.payroll.PayrollService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import com.hrms.hr_payroll_management_system.enums.AuditAction;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeSalaryRepository employeeSalaryRepository;
    private final PayrollAdjustmentRepository adjustmentRepository;
        private final AuditLogService auditLogService;
    // Phase 10
    private final PayrollCalculationService payrollCalculationService;
    private final BenefitRuleRepository benefitRuleRepository;
    


    @Override
    public PayrollResponse generate(
            GeneratePayrollRequest request
    ) {

        // =========================================================
        // 1. Check duplicate payroll
        // =========================================================

        if (payrollRepository
                .existsByEmployeeIdAndYearAndMonth(
                        request.getEmployeeId(),
                        request.getYear(),
                        request.getMonth()
                )) {

            throw new DuplicateResourceException(
                    "Payroll already exists for this employee and period."
            );
        }

        // =========================================================
        // 2. Find employee
        // =========================================================

        Employee employee =
                employeeRepository
                        .findById(request.getEmployeeId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found."
                                )
                        );

        // =========================================================
        // 3. Payroll period
        // =========================================================

        LocalDate periodStart =
                LocalDate.of(
                        request.getYear(),
                        request.getMonth(),
                        1
                );

        LocalDate periodEnd =
                periodStart.withDayOfMonth(
                        periodStart.lengthOfMonth()
                );

        // =========================================================
        // 4. Find active employee salary
        // =========================================================

        EmployeeSalary employeeSalary =
                employeeSalaryRepository
                        .findActiveSalary(
                                employee.getId(),
                                periodEnd
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Active salary not found for employee."
                                )
                        );

        SalaryStructure structure =
                employeeSalary.getSalaryStructure();

        // =========================================================
        // 5. Basic salary
        // =========================================================

        BigDecimal basic =
                safe(structure.getBasicSalary());

        // =========================================================
        // 6. Fixed allowances from salary structure
        // =========================================================

        BigDecimal fixedAllowance =
                safe(structure.getHousingAllowance())
                        .add(
                                safe(
                                        structure.getTransportAllowance()
                                )
                        )
                        .add(
                                safe(
                                        structure.getMealAllowance()
                                )
                        );

        // =========================================================
        // 7. Payroll adjustments
        // =========================================================

        List<PayrollAdjustment> adjustments =
                adjustmentRepository
                        .findByEmployeeIdAndEffectiveDateBetween(
                                employee.getId(),
                                periodStart,
                                periodEnd
                        );

        // =========================================================
        // 8. Extra allowance
        // =========================================================

        BigDecimal extraAllowance =
                adjustments.stream()
                        .filter(a ->
                                a.getType()
                                        == AdjustmentType.ALLOWANCE
                        )
                        .map(PayrollAdjustment::getAmount)
                        .map(this::safe)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        // =========================================================
        // 9. Normal deductions
        // =========================================================

        BigDecimal deductions =
                adjustments.stream()
                        .filter(a ->
                                a.getType()
                                        == AdjustmentType.DEDUCTION
                        )
                        .map(PayrollAdjustment::getAmount)
                        .map(this::safe)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        // =========================================================
        // 10. Total allowance before Phase 10 benefits
        // =========================================================

        BigDecimal totalAllowance =
                fixedAllowance.add(extraAllowance);

        // =========================================================
        // 11. Overtime
        // =========================================================

        BigDecimal overtimePay =
                payrollCalculationService
                        .calculateOvertimePay(
                                employee,
                                structure,
                                request.getYear(),
                                request.getMonth()
                        );

        // =========================================================
        // 12. Benefit rules
        // =========================================================

        List<BenefitRule> benefitRules =
                benefitRuleRepository.findByActiveTrue();

        // =========================================================
        // 13. Employee contribution
        // =========================================================

        BigDecimal employeeContribution =
                calculateBenefits(
                        benefitRules,
                        BenefitType.EMPLOYEE_DEDUCTION,
                        basic
                );

        // =========================================================
        // 14. Employer contribution
        // =========================================================

        BigDecimal employerContribution =
                calculateBenefits(
                        benefitRules,
                        BenefitType.EMPLOYER_CONTRIBUTION,
                        basic
                );

        // =========================================================
        // 15. Benefit allowance
        // =========================================================

        BigDecimal benefitAllowance =
                calculateBenefits(
                        benefitRules,
                        BenefitType.ALLOWANCE,
                        basic
                );

        totalAllowance =
                totalAllowance.add(
                        benefitAllowance
                );

        // =========================================================
        // 16. Gross salary
        //
        // Basic
        // + Total Allowance
        // + Overtime
        // = Gross
        // =========================================================

        BigDecimal gross =
                basic
                        .add(totalAllowance)
                        .add(overtimePay)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        // =========================================================
        // 17. Tax
        // =========================================================

        BigDecimal taxAmount =
                payrollCalculationService
                        .calculateTax(gross);

        // =========================================================
        // 18. Final deductions
        //
        // Normal deductions
        // + Tax
        // + Employee contribution
        // =========================================================

        BigDecimal finalDeduction =
                deductions
                        .add(taxAmount)
                        .add(employeeContribution)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        // =========================================================
        // 19. Net salary
        // =========================================================

        BigDecimal net =
                gross
                        .subtract(finalDeduction)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        // =========================================================
        // 20. Prevent negative salary
        // =========================================================

        if (net.compareTo(BigDecimal.ZERO) < 0) {

            throw new BadRequestException(
                    "Net salary cannot be negative."
            );
        }

        // =========================================================
        // 21. Create Payroll
        // =========================================================

        Payroll payroll =
                Payroll.builder()
                        .employee(employee)

                        .year(
                                request.getYear()
                        )

                        .month(
                                request.getMonth()
                        )

                        .basicSalary(
                                basic
                        )

                        .totalAllowance(
                                totalAllowance
                        )

                        .totalDeduction(
                                finalDeduction
                        )

                        .overtimePay(
                                overtimePay
                        )

                        .taxAmount(
                                taxAmount
                        )

                        .employeeContribution(
                                employeeContribution
                        )

                        .employerContribution(
                                employerContribution
                        )

                        .grossSalary(
                                gross
                        )

                        .netSalary(
                                net
                        )

                        .status(
                                PayrollStatus.CALCULATED
                        )

                        .build();

        // =========================================================
        // 22. Save payroll
        // =========================================================

        Payroll saved =
        payrollRepository.save(
                payroll
        );

        auditLogService.log(
                AuditAction.PROCESS,
                "PAYROLL",
                saved.getId(),
                "Payroll generated."
        );

        return mapResponse(saved);
    }

    // =============================================================
    // GET BY ID
    // =============================================================

    @Override
    @Transactional(readOnly = true)
    public PayrollResponse getById(Long id) {

        return mapResponse(
                getPayroll(id)
        );
    }

    // =============================================================
    // GET ALL
    // =============================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getAll() {

        return payrollRepository
                .findAll()
                .stream()
                .map(this::mapResponse)
                .toList();
    }

    // =============================================================
    // APPROVE
    // =============================================================

    @Override
    public PayrollResponse approve(Long id) {

        Payroll payroll =
                getPayroll(id);

        if (payroll.getStatus()
                != PayrollStatus.CALCULATED) {

            throw new BadRequestException(
                    "Only calculated payroll can be approved."
            );
        }

        payroll.setStatus(
        PayrollStatus.APPROVED
        );

        Payroll saved =
                payrollRepository.save(
                        payroll
                );

        auditLogService.log(
                AuditAction.APPROVE,
                "PAYROLL",
                saved.getId(),
                "Payroll approved."
        );

        return mapResponse(saved);
    }

    // =============================================================
    // MARK PAID
    // =============================================================

    @Override
    public PayrollResponse markPaid(Long id) {

        Payroll payroll =
                getPayroll(id);

        if (payroll.getStatus()
                != PayrollStatus.APPROVED) {

            throw new BadRequestException(
                    "Only approved payroll can be marked as paid."
            );
        }

       payroll.setStatus(
        PayrollStatus.PAID
        );

        Payroll saved =
                payrollRepository.save(
                        payroll
                );

        auditLogService.log(
                AuditAction.UPDATE,
                "PAYROLL",
                saved.getId(),
                "Payroll marked as paid."
        );

        return mapResponse(saved);
    }

    // =============================================================
    // GET PAYROLL
    // =============================================================

    private Payroll getPayroll(Long id) {

        return payrollRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payroll not found."
                        )
                );
    }

    // =============================================================
    // SAFE BIG DECIMAL
    // =============================================================

    private BigDecimal safe(
            BigDecimal value
    ) {

        return value == null
                ? BigDecimal.ZERO
                : value;
    }

    // =============================================================
    // CALCULATE BENEFITS
    //
    // Supports:
    // - fixed amount
    // - percentage of basic salary
    // =============================================================

    private BigDecimal calculateBenefits(
            List<BenefitRule> rules,
            BenefitType type,
            BigDecimal basicSalary
    ) {

        return rules.stream()
                .filter(rule ->
                        rule.getType() == type
                )
                .map(rule -> {

                    BigDecimal amount =
                            BigDecimal.ZERO;

                    // Fixed amount
                    if (rule.getFixedAmount() != null) {

                        amount =
                                amount.add(
                                        rule.getFixedAmount()
                                );
                    }

                    // Percentage
                    if (rule.getPercentage() != null) {

                        BigDecimal percentage =
                                rule.getPercentage()
                                        .divide(
                                                BigDecimal.valueOf(100),
                                                10,
                                                RoundingMode.HALF_UP
                                        );

                        amount =
                                amount.add(
                                        basicSalary.multiply(
                                                percentage
                                        )
                                );
                    }

                    return amount;
                })
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                )
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                );
    }

    // =============================================================
    // MAP RESPONSE
    // =============================================================

    private PayrollResponse mapResponse(
            Payroll payroll
    ) {

        Employee employee =
                payroll.getEmployee();

        return PayrollResponse.builder()

                .id(
                        payroll.getId()
                )

                .employeeId(
                        employee.getId()
                )

                .employeeCode(
                        employee.getEmployeeCode()
                )

                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )

                .year(
                        payroll.getYear()
                )

                .month(
                        payroll.getMonth()
                )

                .basicSalary(
                        payroll.getBasicSalary()
                )

                .totalAllowance(
                        payroll.getTotalAllowance()
                )

                .totalDeduction(
                        payroll.getTotalDeduction()
                )

                .overtimePay(
                        payroll.getOvertimePay()
                )

                .taxAmount(
                        payroll.getTaxAmount()
                )

                .employeeContribution(
                        payroll.getEmployeeContribution()
                )

                .employerContribution(
                        payroll.getEmployerContribution()
                )

                .grossSalary(
                        payroll.getGrossSalary()
                )

                .netSalary(
                        payroll.getNetSalary()
                )

                .status(
                        payroll.getStatus().name()
                )

                .build();
    }
}
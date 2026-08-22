package com.hrms.hr_payroll_management_system.service.payroll.impl;

import com.hrms.hr_payroll_management_system.entity.Attendance;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.payroll.OvertimeRate;
import com.hrms.hr_payroll_management_system.entity.payroll.SalaryStructure;
import com.hrms.hr_payroll_management_system.entity.payroll.TaxBracket;
import com.hrms.hr_payroll_management_system.repository.AttendanceRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.OvertimeRateRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.TaxBracketRepository;
import com.hrms.hr_payroll_management_system.service.payroll.PayrollCalculationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayrollCalculationServiceImpl
        implements PayrollCalculationService {

    private final AttendanceRepository attendanceRepository;
    private final OvertimeRateRepository overtimeRateRepository;
    private final TaxBracketRepository taxBracketRepository;

    @Override
    public BigDecimal calculateOvertimePay(
            Employee employee,
            SalaryStructure salaryStructure,
            int year,
            int month
    ) {

        LocalDate start =
                LocalDate.of(year, month, 1);

        LocalDate end =
                start.withDayOfMonth(
                        start.lengthOfMonth()
                );

        List<Attendance> attendances =
                attendanceRepository
                        .findByEmployeeIdAndWorkDateBetween(
                                employee.getId(),
                                start,
                                end
                        );

        long overtimeMinutes =
                attendances.stream()
                        .mapToLong(a ->
                                a.getOvertimeMinutes() == null
                                        ? 0
                                        : a.getOvertimeMinutes()
                        )
                        .sum();

        if (overtimeMinutes <= 0) {
            return BigDecimal.ZERO;
        }

        OvertimeRate rate =
                overtimeRateRepository
                        .findByName("NORMAL_OT")
                        .orElse(null);

        if (rate == null) {
            return BigDecimal.ZERO;
        }

        /*
         * Generic calculation assumption:
         * monthly salary / 26 days / 8 hours
         *
         * Keep this configurable later if your company
         * uses another payroll policy.
         */
        BigDecimal hourlyRate =
                salaryStructure.getBasicSalary()
                        .divide(
                                BigDecimal.valueOf(26),
                                10,
                                RoundingMode.HALF_UP
                        )
                        .divide(
                                BigDecimal.valueOf(8),
                                10,
                                RoundingMode.HALF_UP
                        );

        BigDecimal overtimeHours =
                BigDecimal.valueOf(overtimeMinutes)
                        .divide(
                                BigDecimal.valueOf(60),
                                10,
                                RoundingMode.HALF_UP
                        );

        return hourlyRate
                .multiply(overtimeHours)
                .multiply(rate.getMultiplier())
                .setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal calculateTax(
            BigDecimal taxableIncome
    ) {

        if (taxableIncome == null
                || taxableIncome.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        List<TaxBracket> brackets =
                taxBracketRepository
                        .findAllByOrderByMinIncomeAsc();

        BigDecimal tax = BigDecimal.ZERO;

        for (TaxBracket bracket : brackets) {

            if (taxableIncome.compareTo(
                    bracket.getMinIncome()
            ) <= 0) {
                continue;
            }

            BigDecimal upper =
                    bracket.getMaxIncome() == null
                            ? taxableIncome
                            : taxableIncome.min(
                                    bracket.getMaxIncome()
                            );

            BigDecimal taxablePart =
                    upper.subtract(
                            bracket.getMinIncome()
                    );

            if (taxablePart.compareTo(
                    BigDecimal.ZERO
            ) <= 0) {
                continue;
            }

            BigDecimal bracketTax =
                    taxablePart.multiply(
                            bracket.getRate()
                                    .divide(
                                            BigDecimal.valueOf(100),
                                            10,
                                            RoundingMode.HALF_UP
                                    )
                    );

            tax = tax.add(bracketTax);
        }

        return tax.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }
}
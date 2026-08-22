package com.hrms.hr_payroll_management_system.service.payroll.impl;

import com.hrms.hr_payroll_management_system.dto.response.payroll.PayslipResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.payroll.Payroll;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.payroll.PayrollRepository;
import com.hrms.hr_payroll_management_system.service.payroll.PayslipService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayslipServiceImpl
        implements PayslipService {

    private final PayrollRepository payrollRepository;

    @Override
    public PayslipResponse getPayslip(
            Long payrollId
    ) {

        Payroll payroll =
                payrollRepository.findById(payrollId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payroll not found."
                                )
                        );

        Employee employee =
                payroll.getEmployee();

        BigDecimal otherDeduction =
                payroll.getTotalDeduction()
                        .subtract(
                                safe(payroll.getTaxAmount())
                        )
                        .subtract(
                                safe(
                                        payroll.getEmployeeContribution()
                                )
                        );

        if (otherDeduction.compareTo(
                BigDecimal.ZERO
        ) < 0) {
            otherDeduction = BigDecimal.ZERO;
        }

        return PayslipResponse.builder()
                .payrollId(payroll.getId())

                .employeeId(employee.getId())
                .employeeCode(
                        employee.getEmployeeCode()
                )
                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )

                .year(payroll.getYear())
                .month(payroll.getMonth())

                .basicSalary(
                        payroll.getBasicSalary()
                )

                .allowance(
                        payroll.getTotalAllowance()
                )

                .overtimePay(
                        payroll.getOvertimePay()
                )

                .grossSalary(
                        payroll.getGrossSalary()
                )

                .tax(
                        payroll.getTaxAmount()
                )

                .employeeContribution(
                        payroll.getEmployeeContribution()
                )

                .otherDeduction(
                        otherDeduction
                )

                .employerContribution(
                        payroll.getEmployerContribution()
                )

                .netSalary(
                        payroll.getNetSalary()
                )

                .status(
                        payroll.getStatus().name()
                )
                .build();
    }

    private BigDecimal safe(
            BigDecimal value
    ) {

        return value == null
                ? BigDecimal.ZERO
                : value;
    }
}
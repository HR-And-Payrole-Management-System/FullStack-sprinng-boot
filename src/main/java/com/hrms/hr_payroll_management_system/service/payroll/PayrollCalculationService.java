package com.hrms.hr_payroll_management_system.service.payroll;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.payroll.SalaryStructure;

import java.math.BigDecimal;

public interface PayrollCalculationService {

    BigDecimal calculateOvertimePay(
            Employee employee,
            SalaryStructure salaryStructure,
            int year,
            int month
    );

    BigDecimal calculateTax(
            BigDecimal taxableIncome
    );
}
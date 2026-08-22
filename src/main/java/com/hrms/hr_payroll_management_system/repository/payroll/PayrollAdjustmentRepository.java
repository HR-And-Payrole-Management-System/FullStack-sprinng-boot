package com.hrms.hr_payroll_management_system.repository.payroll;

import com.hrms.hr_payroll_management_system.entity.payroll.PayrollAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PayrollAdjustmentRepository
        extends JpaRepository<PayrollAdjustment, Long> {

    List<PayrollAdjustment>
    findByEmployeeIdAndEffectiveDateBetween(
            Long employeeId,
            LocalDate start,
            LocalDate end
    );
}
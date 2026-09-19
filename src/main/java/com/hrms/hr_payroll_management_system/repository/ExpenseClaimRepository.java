package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.ExpenseClaim;
import com.hrms.hr_payroll_management_system.enums.ExpenseCategory;
import com.hrms.hr_payroll_management_system.enums.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseClaimRepository extends JpaRepository<ExpenseClaim, Long> {

    List<ExpenseClaim> findByEmployeeId(Long employeeId);

    List<ExpenseClaim> findByStatus(ExpenseStatus status);

    List<ExpenseClaim> findByEmployeeIdAndCategoryAndStatusInAndExpenseDateBetween(
            Long employeeId, ExpenseCategory category, List<ExpenseStatus> statuses,
            LocalDate start, LocalDate end
    );
}
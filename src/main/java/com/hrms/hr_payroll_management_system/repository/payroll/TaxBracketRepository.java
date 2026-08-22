package com.hrms.hr_payroll_management_system.repository.payroll;

import com.hrms.hr_payroll_management_system.entity.payroll.TaxBracket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaxBracketRepository
        extends JpaRepository<TaxBracket, Long> {

    List<TaxBracket> findAllByOrderByMinIncomeAsc();
}
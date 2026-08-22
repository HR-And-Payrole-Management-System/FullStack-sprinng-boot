package com.hrms.hr_payroll_management_system.repository.payroll;

import com.hrms.hr_payroll_management_system.entity.payroll.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PayrollRepository
        extends JpaRepository<Payroll, Long> {

    boolean existsByEmployeeIdAndYearAndMonth(
            Long employeeId,
            Integer year,
            Integer month
    );

    Optional<Payroll> findByEmployeeIdAndYearAndMonth(
            Long employeeId,
            Integer year,
            Integer month
    );
    List<Payroll> findByYearAndMonth(
            Integer year,
            Integer month
    );
}
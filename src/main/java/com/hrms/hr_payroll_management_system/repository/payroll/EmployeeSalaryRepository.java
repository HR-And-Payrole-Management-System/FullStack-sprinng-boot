package com.hrms.hr_payroll_management_system.repository.payroll;

import com.hrms.hr_payroll_management_system.entity.payroll.EmployeeSalary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface EmployeeSalaryRepository
        extends JpaRepository<EmployeeSalary, Long> {

    @Query("""
        select s
        from EmployeeSalary s
        where s.employee.id = :employeeId
          and s.effectiveDate <= :date
          and (s.endDate is null or s.endDate >= :date)
        order by s.effectiveDate desc
    """)
    Optional<EmployeeSalary> findActiveSalary(
            @Param("employeeId") Long employeeId,
            @Param("date") LocalDate date
    );
}
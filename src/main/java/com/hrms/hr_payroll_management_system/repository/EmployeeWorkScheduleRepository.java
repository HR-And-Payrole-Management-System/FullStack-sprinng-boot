package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.EmployeeWorkSchedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeWorkScheduleRepository
        extends JpaRepository<EmployeeWorkSchedule, Long> {

    List<EmployeeWorkSchedule> findByEmployeeIdOrderByEffectiveDateDesc(
            Long employeeId
    );

    @Query("""
            select count(e) > 0
            from EmployeeWorkSchedule e
            where e.employee.id = :employeeId
              and (
                    e.endDate is null
                    or e.endDate >= :newStart
                  )
              and (
                    :newEnd is null
                    or e.effectiveDate <= :newEnd
                  )
            """)
    boolean existsOverlappingSchedule(
            @Param("employeeId") Long employeeId,
            @Param("newStart") LocalDate newStart,
            @Param("newEnd") LocalDate newEnd
    );
}
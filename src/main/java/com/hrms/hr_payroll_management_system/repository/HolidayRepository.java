package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Holiday;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HolidayRepository
        extends JpaRepository<Holiday, Long> {

    boolean existsByNameAndHolidayDate(
            String name,
            LocalDate holidayDate
    );

        @Query("""
                select case when count(h) > 0 then true else false end
                from Holiday h
                where h.active = true
                and :date between h.holidayDate and h.endDate
        """)
        boolean existsByDateInRangeAndActiveTrue(
                @Param("date") LocalDate date
        );

        // ⚠️ កែ — ប្តូរពី exact holidayDate match ទៅ true overlap check
        @Query("""
                select h
                from Holiday h
                where h.active = true
                and h.holidayDate <= :endDate
                and h.endDate >= :startDate
                order by h.holidayDate asc
        """)
        List<Holiday> findByHolidayDateBetweenAndActiveTrueOrderByHolidayDateAsc(
                @Param("startDate") LocalDate startDate,
                @Param("endDate") LocalDate endDate
        );

        boolean existsByHolidayDateAndActiveTrue(
                LocalDate holidayDate
        );

        // ⚠️ កែ — overlap check ជំនួស exact holidayDate match
        @Query("""
                select h
                from Holiday h
                where h.active = true
                and h.holidayDate <= :endDate
                and h.endDate >= :startDate
                and (
                        (h.company is null and h.branch is null)
                        or h.company.id = :companyId
                        or h.branch.id = :branchId
                )
                order by h.holidayDate asc
        """)
        List<Holiday> findApplicableHolidays(
                @Param("companyId") Long companyId,
                @Param("branchId") Long branchId,
                @Param("startDate") LocalDate startDate,
                @Param("endDate") LocalDate endDate
        );

}
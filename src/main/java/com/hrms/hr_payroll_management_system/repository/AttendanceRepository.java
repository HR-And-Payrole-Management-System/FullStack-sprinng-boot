package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.time.LocalDate;

import java.util.Optional;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long>,
        JpaSpecificationExecutor<Attendance> {

    Optional<Attendance> findByEmployeeIdAndWorkDate(
            Long employeeId,
            LocalDate workDate
    );

    boolean existsByEmployeeIdAndWorkDate(
            Long employeeId,
            LocalDate workDate
    );

    Page<Attendance> findByEmployeeIdAndWorkDateBetween(
            Long employeeId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );
    List<Attendance> findByEmployeeIdAndWorkDateBetween(
        Long employeeId,
        LocalDate startDate,
        LocalDate endDate
);
        long countByWorkDateAndStatus(
                LocalDate workDate,
                AttendanceStatus status
        );
        
        List<Attendance> findByWorkDateBetween(
                LocalDate startDate,
                LocalDate endDate
        );
        }
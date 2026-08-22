package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.LeaveRequest;
import com.hrms.hr_payroll_management_system.enums.LeaveRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
 import java.util.List;
import java.time.LocalDate;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Long> {

    Page<LeaveRequest> findByEmployeeId(
            Long employeeId,
            Pageable pageable
    );

    boolean existsByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long employeeId,
            LeaveRequestStatus status,
            LocalDate endDate,
            LocalDate startDate
    );
      long countByStatusAndStartDateBetween(
            LeaveRequestStatus status,
            LocalDate startDate,
            LocalDate endDate
    );
 
    List<LeaveRequest> findByStartDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );
}
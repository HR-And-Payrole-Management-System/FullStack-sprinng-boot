package com.hrms.hr_payroll_management_system.repository.document;

import com.hrms.hr_payroll_management_system.entity.document.EmployeeDocument;
import com.hrms.hr_payroll_management_system.enums.DocumentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeDocumentRepository
        extends JpaRepository<EmployeeDocument, Long> {

    List<EmployeeDocument>
    findByEmployeeIdOrderByIdDesc(
            Long employeeId
    );

    List<EmployeeDocument>
    findByStatus(
            DocumentStatus status
    );

    List<EmployeeDocument>
    findByExpiryDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    
    
    List<EmployeeDocument>
        findByExpiryDateBeforeAndStatusIn(
                LocalDate date,
                List<DocumentStatus> statuses
        );
}
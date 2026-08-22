package com.hrms.hr_payroll_management_system.repository.document;

import com.hrms.hr_payroll_management_system.entity.document.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository
        extends JpaRepository<DocumentType, Long> {

    boolean existsByNameIgnoreCase(String name);
}
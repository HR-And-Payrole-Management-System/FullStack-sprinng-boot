package com.hrms.hr_payroll_management_system.service.document;

import com.hrms.hr_payroll_management_system.dto.request.document.CreateEmployeeDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.request.document.UpdateEmployeeDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.request.document.VerifyDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.response.document.EmployeeDocumentResponse;
import com.hrms.hr_payroll_management_system.entity.document.EmployeeDocument;
import com.hrms.hr_payroll_management_system.enums.DocumentStatus;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeDocumentService {

    EmployeeDocumentResponse create(
            Long employeeId,
            CreateEmployeeDocumentRequest request
    );

    EmployeeDocumentResponse getById(Long id);

    List<EmployeeDocumentResponse> getByEmployee(
            Long employeeId
    );

    EmployeeDocumentResponse update(
            Long id,
            UpdateEmployeeDocumentRequest request
    );

    EmployeeDocumentResponse verify(
            Long id,
            VerifyDocumentRequest request
    );

    List<EmployeeDocumentResponse> getExpiring(
            LocalDate startDate,
            LocalDate endDate
    );

    int markExpiredDocuments();

    void delete(Long id);

    
}
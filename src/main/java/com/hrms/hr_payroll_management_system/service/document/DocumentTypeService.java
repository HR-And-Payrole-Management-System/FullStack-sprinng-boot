package com.hrms.hr_payroll_management_system.service.document;

import com.hrms.hr_payroll_management_system.dto.request.document.CreateDocumentTypeRequest;
import com.hrms.hr_payroll_management_system.dto.response.document.DocumentTypeResponse;

import java.util.List;

public interface DocumentTypeService {

    DocumentTypeResponse create(
            CreateDocumentTypeRequest request
    );

    List<DocumentTypeResponse> getAll();

    DocumentTypeResponse getById(Long id);

    void delete(Long id);
}
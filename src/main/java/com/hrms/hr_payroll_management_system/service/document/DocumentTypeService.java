package com.hrms.hr_payroll_management_system.service.document;

import com.hrms.hr_payroll_management_system.dto.request.document.CreateDocumentTypeRequest;
import com.hrms.hr_payroll_management_system.dto.response.document.DocumentTypeResponse;
import com.hrms.hr_payroll_management_system.dto.response.document.UploadedFileResponse;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentTypeService {

    DocumentTypeResponse create(
            CreateDocumentTypeRequest request
    );

    List<DocumentTypeResponse> getAll();

    DocumentTypeResponse getById(Long id);

    void delete(Long id);

    
}
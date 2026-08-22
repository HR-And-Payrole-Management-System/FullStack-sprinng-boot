package com.hrms.hr_payroll_management_system.service.document.impl;

import com.hrms.hr_payroll_management_system.dto.request.document.CreateEmployeeDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.request.document.UpdateEmployeeDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.request.document.VerifyDocumentRequest;
import com.hrms.hr_payroll_management_system.dto.response.document.EmployeeDocumentResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.document.DocumentType;
import com.hrms.hr_payroll_management_system.entity.document.EmployeeDocument;
import com.hrms.hr_payroll_management_system.enums.DocumentStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.document.DocumentTypeRepository;
import com.hrms.hr_payroll_management_system.repository.document.EmployeeDocumentRepository;
import com.hrms.hr_payroll_management_system.service.audit.AuditLogService;
import com.hrms.hr_payroll_management_system.service.document.EmployeeDocumentService;
import com.hrms.hr_payroll_management_system.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;
import com.hrms.hr_payroll_management_system.dto.request.notification.CreateNotificationRequest;
import com.hrms.hr_payroll_management_system.enums.NotificationType;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hrms.hr_payroll_management_system.enums.AuditAction;


import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeDocumentServiceImpl
        implements EmployeeDocumentService {

    private final EmployeeDocumentRepository documentRepository;
    private final DocumentTypeRepository typeRepository;
    private final EmployeeRepository employeeRepository;
        private final NotificationService notificationService;
        private final AuditLogService auditLogService;
    @Override
    public EmployeeDocumentResponse create(
            Long employeeId,
            CreateEmployeeDocumentRequest request
    ) {

        Employee employee =
                getEmployee(employeeId);

        DocumentType type =
                typeRepository
                        .findById(
                                request.getDocumentTypeId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Document type not found."
                                )
                        );

        if (!type.getActive()) {
            throw new BadRequestException(
                    "Document type is inactive."
            );
        }

        validateDates(
                request.getIssueDate(),
                request.getExpiryDate()
        );

        if (Boolean.TRUE.equals(
                type.getRequiresExpiry()
        ) && request.getExpiryDate() == null) {

            throw new BadRequestException(
                    "Expiry date is required for this document type."
            );
        }

        EmployeeDocument document =
                EmployeeDocument.builder()
                        .employee(employee)
                        .documentType(type)
                        .documentNumber(
                                request.getDocumentNumber()
                        )
                        .fileName(
                                request.getFileName()
                        )
                        .fileUrl(
                                request.getFileUrl()
                        )
                        .issueDate(
                                request.getIssueDate()
                        )
                        .expiryDate(
                                request.getExpiryDate()
                        )
                        .status(
                                DocumentStatus.PENDING
                        )
                        .build();

        return map(
                documentRepository.save(document)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDocumentResponse getById(Long id) {

        return map(getDocument(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDocumentResponse> getByEmployee(
            Long employeeId
    ) {

        getEmployee(employeeId);

        return documentRepository
                .findByEmployeeIdOrderByIdDesc(
                        employeeId
                )
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public EmployeeDocumentResponse update(
            Long id,
            UpdateEmployeeDocumentRequest request
    ) {

        EmployeeDocument document =
                getDocument(id);

        if (document.getStatus()
                == DocumentStatus.VERIFIED) {

            throw new BadRequestException(
                    "Verified document cannot be modified."
            );
        }

        LocalDate issueDate =
                request.getIssueDate() != null
                        ? request.getIssueDate()
                        : document.getIssueDate();

        LocalDate expiryDate =
                request.getExpiryDate() != null
                        ? request.getExpiryDate()
                        : document.getExpiryDate();

        validateDates(issueDate, expiryDate);

        if (request.getDocumentNumber() != null) {
            document.setDocumentNumber(
                    request.getDocumentNumber()
            );
        }

        if (request.getFileName() != null) {
            document.setFileName(
                    request.getFileName()
            );
        }

        if (request.getFileUrl() != null) {
            document.setFileUrl(
                    request.getFileUrl()
            );
        }

        if (request.getIssueDate() != null) {
            document.setIssueDate(
                    request.getIssueDate()
            );
        }

        if (request.getExpiryDate() != null) {
            document.setExpiryDate(
                    request.getExpiryDate()
            );
        }

        return map(
                documentRepository.save(document)
        );
    }

    @Override
    public EmployeeDocumentResponse verify(
            Long id,
            VerifyDocumentRequest request
    ) {

        EmployeeDocument document =
                getDocument(id);

        if (document.getStatus()
                == DocumentStatus.EXPIRED) {

            throw new BadRequestException(
                    "Expired document cannot be verified."
            );
        }

        if (Boolean.TRUE.equals(
                request.getApproved()
        )) {

            document.setStatus(
                    DocumentStatus.VERIFIED
            );

        } else {

            document.setStatus(
                    DocumentStatus.REJECTED
            );
        }

        document.setVerificationNote(
                request.getNote()
        );

        EmployeeDocument saved =
        documentRepository.save(
                document
        );

        auditLogService.log(
                Boolean.TRUE.equals(
                        request.getApproved()
                )
                        ? AuditAction.VERIFY
                        : AuditAction.REJECT,
                "EMPLOYEE_DOCUMENT",
                saved.getId(),
                Boolean.TRUE.equals(
                        request.getApproved()
                )
                        ? "Employee document verified."
                        : "Employee document rejected."
        );

        return map(saved);
        }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDocumentResponse> getExpiring(
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (startDate == null || endDate == null) {
            throw new BadRequestException(
                    "Start date and end date are required."
            );
        }

        if (endDate.isBefore(startDate)) {
            throw new BadRequestException(
                    "End date cannot be before start date."
            );
        }

        return documentRepository
                .findByExpiryDateBetween(
                        startDate,
                        endDate
                )
                .stream()
                .map(this::map)
                .toList();
    }

        @Override
        public int markExpiredDocuments() {

        List<EmployeeDocument> documents =
                documentRepository
                        .findByExpiryDateBeforeAndStatusIn(
                                LocalDate.now(),
                                List.of(
                                        DocumentStatus.PENDING,
                                        DocumentStatus.VERIFIED
                                )
                        );

        for (EmployeeDocument document
                : documents) {

                document.setStatus(
                        DocumentStatus.EXPIRED
                );

                CreateNotificationRequest request =
                        new CreateNotificationRequest();

                request.setEmployeeId(
                        document.getEmployee().getId()
                );

                request.setType(
                        NotificationType.DOCUMENT_EXPIRED
                );

                request.setTitle(
                        "Document expired"
                );

                request.setMessage(
                        document.getDocumentType().getName()
                                + " has expired."
                );

                request.setReferenceType(
                        "EMPLOYEE_DOCUMENT"
                );

                request.setReferenceId(
                        document.getId()
                );

                notificationService.create(request);
        }

        documentRepository.saveAll(
                documents
        );

        return documents.size();
        }

    @Override
    public void delete(Long id) {

        EmployeeDocument document =
                getDocument(id);

        documentRepository.delete(document);
    }

    private EmployeeDocument getDocument(
            Long id
    ) {

        return documentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee document not found."
                        )
                );
    }

    private Employee getEmployee(Long id) {

        return employeeRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found."
                        )
                );
    }

    private void validateDates(
            LocalDate issueDate,
            LocalDate expiryDate
    ) {

        if (issueDate != null
                && expiryDate != null
                && expiryDate.isBefore(issueDate)) {

            throw new BadRequestException(
                    "Expiry date cannot be before issue date."
            );
        }
    }

    private EmployeeDocumentResponse map(
            EmployeeDocument document
    ) {

        Employee employee =
                document.getEmployee();

        return EmployeeDocumentResponse.builder()
                .id(document.getId())
                .employeeId(employee.getId())
                .employeeCode(
                        employee.getEmployeeCode()
                )
                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )
                .documentTypeId(
                        document.getDocumentType()
                                .getId()
                )
                .documentTypeName(
                        document.getDocumentType()
                                .getName()
                )
                .documentNumber(
                        document.getDocumentNumber()
                )
                .fileName(
                        document.getFileName()
                )
                .fileUrl(
                        document.getFileUrl()
                )
                .issueDate(
                        document.getIssueDate()
                )
                .expiryDate(
                        document.getExpiryDate()
                )
                .status(
                        document.getStatus().name()
                )
                .verificationNote(
                        document.getVerificationNote()
                )
                .build();
    }
}
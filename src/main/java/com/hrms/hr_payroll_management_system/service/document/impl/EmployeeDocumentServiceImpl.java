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
import com.hrms.hr_payroll_management_system.dto.response.document.UploadedFileResponse;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

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
            @Override
        public int markExpiringSoon(int daysBeforeExpiry) {

        List<EmployeeDocument> documents =
                documentRepository
                        .findByExpiryDateBetween(
                                LocalDate.now(),
                                LocalDate.now().plusDays(daysBeforeExpiry)
                        )
                        .stream()
                        .filter(doc ->
                                doc.getStatus() == DocumentStatus.PENDING
                                        || doc.getStatus() == DocumentStatus.VERIFIED
                        )
                        .toList();

        for (EmployeeDocument document
                : documents) {

                CreateNotificationRequest request =
                        new CreateNotificationRequest();

                request.setEmployeeId(
                        document.getEmployee().getId()
                );

                request.setType(
                        NotificationType.DOCUMENT_EXPIRING
                );

                request.setTitle(
                        "Document expiring soon"
                );

                request.setMessage(
                        document.getDocumentType().getName()
                                + " will expire on "
                                + document.getExpiryDate()
                                + "."
                );

                request.setReferenceType(
                        "EMPLOYEE_DOCUMENT"
                );

                request.setReferenceId(
                        document.getId()
                );

                notificationService.create(request);
        }

        return documents.size();
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
    
    @Value("${app.upload.documents-dir}")
        private String documentsDir;

        private static final List<String> ALLOWED_DOCUMENT_TYPES = List.of(
                "image/jpeg", "image/png", "image/webp",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        private static final long MAX_DOCUMENT_BYTES = 10L * 1024 * 1024; // 10MB

        @Override
        public UploadedFileResponse uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
                throw new BadRequestException("No file was uploaded.");
        }
        if (file.getSize() > MAX_DOCUMENT_BYTES) {
                throw new BadRequestException("File must be 10MB or smaller.");
        }
        if (!ALLOWED_DOCUMENT_TYPES.contains(file.getContentType())) {
                throw new BadRequestException("This file type is not allowed. Use JPG, PNG, PDF, or Word.");
        }

        try {
                Path dir = Paths.get(documentsDir);
                Files.createDirectories(dir);

                String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
                String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
                String storedName = "doc-" + UUID.randomUUID() + ext;
                Path target = dir.resolve(storedName);

                Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

                return UploadedFileResponse.builder()
                        .fileName(original)
                        .fileUrl("/uploads/documents/" + storedName)
                        .build();

        } catch (IOException e) {
                throw new BadRequestException("Failed to save the uploaded file.");
        }
        }
}
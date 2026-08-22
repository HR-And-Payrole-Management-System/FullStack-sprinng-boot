package com.hrms.hr_payroll_management_system.service.document.impl;

import com.hrms.hr_payroll_management_system.dto.request.document.CreateDocumentTypeRequest;
import com.hrms.hr_payroll_management_system.dto.response.document.DocumentTypeResponse;
import com.hrms.hr_payroll_management_system.entity.document.DocumentType;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.document.DocumentTypeRepository;
import com.hrms.hr_payroll_management_system.service.document.DocumentTypeService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentTypeServiceImpl
        implements DocumentTypeService {

    private final DocumentTypeRepository repository;

    @Override
    public DocumentTypeResponse create(
            CreateDocumentTypeRequest request
    ) {

        if (repository.existsByNameIgnoreCase(
                request.getName()
        )) {
            throw new DuplicateResourceException(
                    "Document type already exists."
            );
        }

        DocumentType type =
                DocumentType.builder()
                        .name(request.getName())
                        .description(
                                request.getDescription()
                        )
                        .requiresExpiry(
                                request.getRequiresExpiry()
                        )
                        .active(true)
                        .build();

        return map(repository.save(type));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentTypeResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentTypeResponse getById(Long id) {

        return map(getType(id));
    }

    @Override
    public void delete(Long id) {

        repository.delete(getType(id));
    }

    private DocumentType getType(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document type not found."
                        )
                );
    }

    private DocumentTypeResponse map(
            DocumentType type
    ) {

        return DocumentTypeResponse.builder()
                .id(type.getId())
                .name(type.getName())
                .description(type.getDescription())
                .requiresExpiry(type.getRequiresExpiry())
                .active(type.getActive())
                .build();
    }
}
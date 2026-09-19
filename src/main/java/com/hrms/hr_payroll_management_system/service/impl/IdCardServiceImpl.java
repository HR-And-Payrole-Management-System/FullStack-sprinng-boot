package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.idcard.CreateIdCardRequest;
import com.hrms.hr_payroll_management_system.dto.request.idcard.UpdateIdCardRequest;
import com.hrms.hr_payroll_management_system.dto.response.idcard.IdCardResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.IdCard;
import com.hrms.hr_payroll_management_system.enums.AuditAction;
import com.hrms.hr_payroll_management_system.enums.IdCardAccessLevel;
import com.hrms.hr_payroll_management_system.enums.IdCardStatus;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.IdCardMapper;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.IdCardRepository;
import com.hrms.hr_payroll_management_system.service.IdCardService;
import com.hrms.hr_payroll_management_system.service.audit.AuditLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class IdCardServiceImpl implements IdCardService {

    private final IdCardRepository idCardRepository;
    private final EmployeeRepository employeeRepository;
    private final IdCardMapper idCardMapper;
    private final AuditLogService auditLogService;

    @Override
    public IdCardResponse create(Long employeeId, CreateIdCardRequest request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        if (idCardRepository.existsByEmployeeId(employeeId)) {
            throw new DuplicateResourceException("An ID card already exists for this employee.");
        }

        IdCard card = IdCard.builder()
                .employee(employee)
                .cardNumber(
                        request.getCardNumber() != null && !request.getCardNumber().isBlank()
                                ? request.getCardNumber()
                                : employee.getEmployeeCode()
                )
                .status(IdCardStatus.ACTIVE)
                .accessLevel(
                        request.getAccessLevel() != null
                                ? request.getAccessLevel()
                                : IdCardAccessLevel.EMPLOYEE_ACCESS
                )
                .issuedDate(request.getIssuedDate() != null ? request.getIssuedDate() : LocalDate.now())
                .note(request.getNote())
                .build();

        IdCard saved = idCardRepository.save(card);

        auditLogService.log(
                AuditAction.CREATE,
                "IdCard",
                saved.getId(),
                "Issued ID card for employee " + employee.getEmployeeCode()
        );

        return idCardMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public IdCardResponse getById(Long id) {
        IdCard card = findOrThrow(id);
        return idCardMapper.toResponse(card);
    }

    @Override
    @Transactional(readOnly = true)
    public IdCardResponse getByEmployee(Long employeeId) {
        IdCard card = idCardRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("No ID card found for employee id: " + employeeId));
        return idCardMapper.toResponse(card);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<IdCardResponse> getAll(int page, int size, IdCardStatus status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<IdCard> cardPage = status != null
                ? idCardRepository.findByStatus(status, pageable)
                : idCardRepository.findAll(pageable);

        return PageResponse.<IdCardResponse>builder()
                .content(cardPage.getContent().stream().map(idCardMapper::toResponse).toList())
                .page(cardPage.getNumber())
                .size(cardPage.getSize())
                .totalElements(cardPage.getTotalElements())
                .totalPages(cardPage.getTotalPages())
                .first(cardPage.isFirst())
                .last(cardPage.isLast())
                .build();
    }

    @Override
    public IdCardResponse update(Long id, UpdateIdCardRequest request) {

        IdCard card = findOrThrow(id);

        if (request.getStatus() != null) {
            card.setStatus(request.getStatus());
        }
        if (request.getAccessLevel() != null) {
            card.setAccessLevel(request.getAccessLevel());
        }
        if (request.getCardNumber() != null && !request.getCardNumber().isBlank()) {
            card.setCardNumber(request.getCardNumber());
        }
        if (request.getNote() != null) {
            card.setNote(request.getNote());
        }

        IdCard saved = idCardRepository.save(card);

        auditLogService.log(
                AuditAction.UPDATE,
                "IdCard",
                saved.getId(),
                "Updated ID card (status=" + saved.getStatus() + ", accessLevel=" + saved.getAccessLevel() + ") for employee "
                        + saved.getEmployee().getEmployeeCode()
        );

        return idCardMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        IdCard card = findOrThrow(id);
        idCardRepository.delete(card);

        auditLogService.log(
                AuditAction.DELETE,
                "IdCard",
                id,
                "Deleted ID card for employee " + card.getEmployee().getEmployeeCode()
        );
    }

    private IdCard findOrThrow(Long id) {
        return idCardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ID card not found with id: " + id));
    }
}
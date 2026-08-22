package com.hrms.hr_payroll_management_system.service.payroll.impl;

import com.hrms.hr_payroll_management_system.dto.request.payroll.CreateSalaryStructureRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.SalaryStructureResponse;
import com.hrms.hr_payroll_management_system.entity.payroll.SalaryStructure;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.payroll.SalaryStructureMapper;
import com.hrms.hr_payroll_management_system.repository.payroll.SalaryStructureRepository;
import com.hrms.hr_payroll_management_system.service.payroll.SalaryStructureService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SalaryStructureServiceImpl
        implements SalaryStructureService {

    private final SalaryStructureRepository repository;
    private final SalaryStructureMapper mapper;

    @Override
    public SalaryStructureResponse create(
            CreateSalaryStructureRequest request
    ) {

        if (repository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Salary structure already exists."
            );
        }

        return mapper.toResponse(
                repository.save(
                        mapper.toEntity(request)
                )
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalaryStructureResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SalaryStructureResponse getById(Long id) {

        SalaryStructure entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Salary structure not found."
                                )
                        );

        return mapper.toResponse(entity);
    }

    @Override
    public void delete(Long id) {

        SalaryStructure entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Salary structure not found."
                                )
                        );

        repository.delete(entity);
    }
}
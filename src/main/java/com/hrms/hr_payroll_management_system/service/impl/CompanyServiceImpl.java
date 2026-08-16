package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.company.CreateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.request.company.UpdateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.response.company.CompanyResponse;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.CompanyMapper;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.service.CompanyService;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl
        implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final OrganizationIntegrityService organizationIntegrityService;
    @Override
    public CompanyResponse create(
            CreateCompanyRequest request
    ) {

        if (companyRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Company name already exists."
            );
        }

        if (companyRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Company email already exists."
            );
        }

        Company company =
                companyMapper.toEntity(request);

        Company savedCompany =
                companyRepository.save(company);

        return companyMapper.toResponse(savedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAll() {

        return companyRepository.findAll()
                .stream()
                .map(companyMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getById(Long id) {

        Company company = getCompany(id);

        return companyMapper.toResponse(company);
    }

    @Override
    public CompanyResponse update(
            Long id,
            UpdateCompanyRequest request
    ) {

        Company company = getCompany(id);

        if (!company.getName()
                .equalsIgnoreCase(request.getName())
                && companyRepository.existsByName(
                        request.getName()
                )) {

            throw new DuplicateResourceException(
                    "Company name already exists."
            );
        }

        if (!company.getEmail()
                .equalsIgnoreCase(request.getEmail())
                && companyRepository.existsByEmail(
                        request.getEmail()
                )) {

            throw new DuplicateResourceException(
                    "Company email already exists."
            );
        }

        companyMapper.updateEntity(
                request,
                company
        );

        Company updatedCompany =
                companyRepository.save(company);

        return companyMapper.toResponse(updatedCompany);
    }

    @Override
    public void delete(Long id) {

        Company company = getCompany(id);

        organizationIntegrityService.validateBranchDeletion(id);

        companyRepository.delete(company);
    }

    private Company getCompany(Long id) {

        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found."
                        )
                );
    }
}
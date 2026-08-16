package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.branch.CreateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.request.branch.UpdateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.response.branch.BranchResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.BranchMapper;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.service.BranchService;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BranchServiceImpl
        implements BranchService {

    private final BranchRepository branchRepository;
    private final CompanyRepository companyRepository;
    private final BranchMapper branchMapper;
    private final OrganizationIntegrityService organizationIntegrityService;
    @Override
    public BranchResponse create(
            CreateBranchRequest request
    ) {

        if (branchRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException(
                    "Branch code already exists."
            );
        }

        Company company =
                companyRepository.findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found."
                                )
                        );
        if (Boolean.TRUE.equals(request.getHeadOffice())
                && branchRepository
                .existsByCompanyIdAndHeadOfficeTrue(
                        company.getId()
                )) {

        throw new BadRequestException(
                "Company already has a head office."
        );
        }

        Branch branch =
                branchMapper.toEntity(request);

        branch.setCompany(company);

        Branch savedBranch =
                branchRepository.save(branch);

        return branchMapper.toResponse(savedBranch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getAll() {

        return branchRepository.findAll()
                .stream()
                .map(branchMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse getById(Long id) {

        Branch branch = getBranch(id);

        return branchMapper.toResponse(branch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getByCompanyId(
            Long companyId
    ) {

        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException(
                    "Company not found."
            );
        }

        return branchRepository
                .findByCompanyId(companyId)
                .stream()
                .map(branchMapper::toResponse)
                .toList();
    }

    @Override
    public BranchResponse update(
            Long id,
            UpdateBranchRequest request
    ) {

        Branch branch = getBranch(id);

        if (!branch.getCode()
                .equalsIgnoreCase(request.getCode())
                && branchRepository.existsByCode(
                        request.getCode()
                )) {

            throw new DuplicateResourceException(
                    "Branch code already exists."
            );
        }

        Company company =
                companyRepository.findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found."
                                )
                        );
        if (Boolean.TRUE.equals(request.getHeadOffice())
                && branchRepository
                .existsByCompanyIdAndHeadOfficeTrueAndIdNot(
                        company.getId(),
                        branch.getId()
                )) {

        throw new BadRequestException(
                "Company already has another head office."
        );
        }

        branchMapper.updateEntity(
                request,
                branch
        );

        branch.setCompany(company);

        Branch updatedBranch =
                branchRepository.save(branch);

        return branchMapper.toResponse(updatedBranch);
    }

    @Override
    public void delete(Long id){
        Branch branch = getBranch(id);

        organizationIntegrityService
                .validateBranchDeletion(id);
        branchRepository.delete(branch);
    }

    private Branch getBranch(Long id) {

        return branchRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Branch not found."
                        )
                );
    }
}
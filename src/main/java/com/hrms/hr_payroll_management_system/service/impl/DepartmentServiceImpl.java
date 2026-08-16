package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.department.AssignDepartmentOrganizationRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.CreateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.UpdateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.response.department.DepartmentResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.DepartmentMapper;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.service.DepartmentService;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl
        implements DepartmentService {

    private final OrganizationIntegrityServiceImpl organizationIntegrityServiceImpl;
    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final BranchRepository branchRepository;
    private final DepartmentMapper departmentMapper;
    private final OrganizationIntegrityService organizationIntegrityService;

    

    @Override
    public DepartmentResponse create(
            CreateDepartmentRequest request
    ) {

        Department department =
                departmentMapper.toEntity(request);

        Department savedDepartment =
                departmentRepository.save(department);

        return departmentMapper.toResponse(
                savedDepartment
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAll() {

        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getById(
            Long id
    ) {

        return departmentMapper.toResponse(
                getDepartment(id)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getByCompanyId(
            Long companyId
    ) {

        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException(
                    "Company not found."
            );
        }

        return departmentRepository
                .findByCompanyId(companyId)
                .stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getByBranchId(
            Long branchId
    ) {

        if (!branchRepository.existsById(branchId)) {
            throw new ResourceNotFoundException(
                    "Branch not found."
            );
        }

        return departmentRepository
                .findByBranchId(branchId)
                .stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    @Override
    public DepartmentResponse update(
            Long id,
            UpdateDepartmentRequest request
    ) {

        Department department =
                getDepartment(id);

        if (department.getBranch() != null
                && !department.getName()
                .equalsIgnoreCase(request.getName())
                && departmentRepository.existsByNameAndBranchId(
                        request.getName(),
                        department.getBranch().getId()
                )) {

            throw new DuplicateResourceException(
                    "Department name already exists in this branch."
            );
        }

        departmentMapper.updateEntity(
                request,
                department
        );

        return departmentMapper.toResponse(
                departmentRepository.save(department)
        );
    }

    @Override
    public DepartmentResponse assignOrganization(
            Long departmentId,
            AssignDepartmentOrganizationRequest request
    ) {

        Department department =
                getDepartment(departmentId);

        Company company =
                companyRepository.findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found."
                                )
                        );

        Branch branch =
                branchRepository.findById(
                                request.getBranchId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Branch not found."
                                )
                        );

        if (!branch.getCompany()
                .getId()
                .equals(company.getId())) {

            throw new BadRequestException(
                    "Branch does not belong to the selected company."
            );
        }

        if (departmentRepository.existsByNameAndBranchId(
                department.getName(),
                branch.getId()
        )) {

            Department current =
                    departmentRepository.findById(
                                    departmentId
                            )
                            .orElseThrow();

            if (current.getBranch() == null
                    || !current.getBranch()
                    .getId()
                    .equals(branch.getId())) {

                throw new DuplicateResourceException(
                        "Department name already exists in this branch."
                );
            }
        }

        department.setCompany(company);
        department.setBranch(branch);

        Department savedDepartment =
                departmentRepository.save(department);

        return departmentMapper.toResponse(
                savedDepartment
        );
    }

    @Override
        public void delete(Long id) {

        Department department =
                getDepartment(id);

        organizationIntegrityService
                .validateDepartmentDeletion(id);

        departmentRepository.delete(department);
        }

    private Department getDepartment(
            Long id
    ) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found."
                        )
                );
    }
}
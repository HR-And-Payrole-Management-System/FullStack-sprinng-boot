package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.position.CreatePositionRequest;
import com.hrms.hr_payroll_management_system.dto.request.position.UpdatePositionRequest;
import com.hrms.hr_payroll_management_system.dto.response.position.PositionResponse;
import com.hrms.hr_payroll_management_system.entity.Position;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.PositionMapper;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.PositionRepository;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;
import com.hrms.hr_payroll_management_system.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hrms.hr_payroll_management_system.dto.request.position.AssignPositionOrganizationRequest;

import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Department;


import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PositionServiceImpl
        implements PositionService {

    private final PositionRepository positionRepository;
    private final PositionMapper positionMapper;
        private final OrganizationIntegrityService organizationIntegrityService;
        private final DepartmentRepository departmentRepository;
        private final BranchRepository branchRepository;
        private final CompanyRepository companyRepository;
            @Override
    public PositionResponse create(
            CreatePositionRequest request
    ) {

        if (positionRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Position already exists."
            );
        }

        Position position =
                positionMapper.toEntity(request);

        return positionMapper.toResponse(
                positionRepository.save(position)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<PositionResponse> getAll() {

        return positionRepository.findAll()
                .stream()
                .map(positionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PositionResponse getById(Long id) {

        Position position =
                positionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Position not found."
                                )
                        );

        return positionMapper.toResponse(position);
    }

    @Override
    public PositionResponse update(
            Long id,
            UpdatePositionRequest request
    ) {

        Position position =
                positionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Position not found."
                                )
                        );

        if (!position.getName().equals(request.getName())
                && positionRepository.existsByName(
                request.getName()
        )) {
            throw new DuplicateResourceException(
                    "Position already exists."
            );
        }

        positionMapper.updateEntity(
                request,
                position
        );

        return positionMapper.toResponse(
                positionRepository.save(position)
        );
    }

    @Override
        public void delete(Long id) {

        Position position = getPosition(id);

        organizationIntegrityService
                .validatePositionDeletion(id);

        positionRepository.delete(position);
        }
    @Override
        public PositionResponse assignOrganization(
                Long positionId,
                AssignPositionOrganizationRequest request
        ) {

        Position position = getPosition(positionId);

        Company company = companyRepository
                .findById(request.getCompanyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found."
                        )
                );

        Branch branch = branchRepository
                .findById(request.getBranchId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Branch not found."
                        )
                );

        Department department = departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found."
                        )
                );

        // Branch must belong to Company
        if (!branch.getCompany()
                .getId()
                .equals(company.getId())) {

                throw new BadRequestException(
                        "Branch does not belong to the selected company."
                );
        }

        // Department must belong to Company
        if (department.getCompany() == null
                || !department.getCompany()
                .getId()
                .equals(company.getId())) {

                throw new BadRequestException(
                        "Department does not belong to the selected company."
                );
        }

        // Department must belong to Branch
        if (department.getBranch() == null
                || !department.getBranch()
                .getId()
                .equals(branch.getId())) {

                throw new BadRequestException(
                        "Department does not belong to the selected branch."
                );
        }

        // Same position name cannot exist twice
        // inside the same department.
        if (positionRepository.existsByNameAndDepartmentId(
                position.getName(),
                department.getId()
        )) {

                if (position.getDepartment() == null
                        || !position.getDepartment()
                        .getId()
                        .equals(department.getId())) {

                throw new DuplicateResourceException(
                        "Position name already exists in this department."
                );
                }
        }

        position.setCompany(company);
        position.setBranch(branch);
        position.setDepartment(department);
        position.setLevel(request.getLevel());

        Position savedPosition =
                positionRepository.save(position);

        return positionMapper.toResponse(
                savedPosition
        );
        }
        @Override
        @Transactional(readOnly = true)
        public List<PositionResponse> getByCompanyId(
                Long companyId
        ) {

        if (!companyRepository.existsById(companyId)) {
                throw new ResourceNotFoundException(
                        "Company not found."
                );
        }

        return positionRepository
                .findByCompanyId(companyId)
                .stream()
                .map(positionMapper::toResponse)
                .toList();
        }
        @Override
        @Transactional(readOnly = true)
        public List<PositionResponse> getByBranchId(
                Long branchId
        ) {

        if (!branchRepository.existsById(branchId)) {
                throw new ResourceNotFoundException(
                        "Branch not found."
                );
        }

        return positionRepository
                .findByBranchId(branchId)
                .stream()
                .map(positionMapper::toResponse)
                .toList();
        }
        @Override
        @Transactional(readOnly = true)
        public List<PositionResponse> getByDepartmentId(
                Long departmentId
        ) {

        if (!departmentRepository.existsById(departmentId)) {
                throw new ResourceNotFoundException(
                        "Department not found."
                );
        }

        return positionRepository
                .findByDepartmentId(departmentId)
                .stream()
                .map(positionMapper::toResponse)
                .toList();
        }
        private Position getPosition(Long id) {

    return positionRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Position not found."
                    )
            );
}
}
package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.response.organization.OrganizationSummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.organization.OrganizationTreeResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.Position;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.PositionRepository;
import com.hrms.hr_payroll_management_system.service.OrganizationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrganizationServiceImpl
        implements OrganizationService {

    private final CompanyRepository companyRepository;
    private final BranchRepository branchRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public OrganizationSummaryResponse getSummary() {

        return OrganizationSummaryResponse.builder()
                .totalCompanies(companyRepository.count())
                .totalBranches(branchRepository.count())
                .totalDepartments(departmentRepository.count())
                .totalPositions(positionRepository.count())
                .totalEmployees(employeeRepository.count())
                .build();
    }

    @Override
    public OrganizationTreeResponse getOrganizationTree(
            Long companyId
    ) {

        Company company = companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found."
                        )
                );

        List<Branch> branches =
                branchRepository.findByCompanyId(companyId);

        List<OrganizationTreeResponse.BranchNode> branchNodes =
                branches.stream()
                        .map(branch ->
                                buildBranchNode(branch)
                        )
                        .toList();

        return OrganizationTreeResponse.builder()
                .companyId(company.getId())
                .companyName(company.getName())
                .branches(branchNodes)
                .build();
    }

    private OrganizationTreeResponse.BranchNode buildBranchNode(
            Branch branch
    ) {

        List<Department> departments =
                departmentRepository.findByBranchId(
                        branch.getId()
                );

        List<OrganizationTreeResponse.DepartmentNode> departmentNodes =
                departments.stream()
                        .map(department ->
                                buildDepartmentNode(department)
                        )
                        .toList();

        return OrganizationTreeResponse.BranchNode.builder()
                .id(branch.getId())
                .code(branch.getCode())
                .name(branch.getName())
                .headOffice(branch.getHeadOffice())
                .departments(departmentNodes)
                .build();
    }

    private OrganizationTreeResponse.DepartmentNode buildDepartmentNode(
            Department department
    ) {

        List<Position> positions =
                positionRepository.findByDepartmentId(
                        department.getId()
                );

        List<OrganizationTreeResponse.PositionNode> positionNodes =
                positions.stream()
                        .map(position ->
                                buildPositionNode(position)
                        )
                        .toList();

        return OrganizationTreeResponse.DepartmentNode.builder()
                .id(department.getId())
                .name(department.getName())
                .positions(positionNodes)
                .build();
    }

    private OrganizationTreeResponse.PositionNode buildPositionNode(
            Position position
    ) {

        long employeeCount =
                employeeRepository.countByPositionId(
                        position.getId()
                );

        return OrganizationTreeResponse.PositionNode.builder()
                .id(position.getId())
                .name(position.getName())
                .level(
                        position.getLevel() == null
                                ? null
                                : position.getLevel().name()
                )
                .employeeCount(employeeCount)
                .build();
    }
}
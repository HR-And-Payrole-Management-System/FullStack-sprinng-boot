package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.PositionRepository;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrganizationIntegrityServiceImpl
        implements OrganizationIntegrityService {

    private final BranchRepository branchRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public void validateCompanyDeletion(Long companyId) {

        if (branchRepository.existsByCompanyId(companyId)) {
            throw new BadRequestException(
                    "Cannot delete company because it still has branches."
            );
        }

        if (departmentRepository.existsByCompanyId(companyId)) {
            throw new BadRequestException(
                    "Cannot delete company because it still has departments."
            );
        }

        if (positionRepository.existsByCompanyId(companyId)) {
            throw new BadRequestException(
                    "Cannot delete company because it still has positions."
            );
        }

        if (employeeRepository.existsByCompanyId(companyId)) {
            throw new BadRequestException(
                    "Cannot delete company because it still has employees."
            );
        }
    }

    @Override
    public void validateBranchDeletion(Long branchId) {

        if (departmentRepository.existsByBranchId(branchId)) {
            throw new BadRequestException(
                    "Cannot delete branch because it still has departments."
            );
        }

        if (positionRepository.existsByBranchId(branchId)) {
            throw new BadRequestException(
                    "Cannot delete branch because it still has positions."
            );
        }

        if (employeeRepository.existsByBranchId(branchId)) {
            throw new BadRequestException(
                    "Cannot delete branch because it still has employees."
            );
        }
    }

    @Override
    public void validateDepartmentDeletion(Long departmentId) {

        if (positionRepository.existsByDepartmentId(departmentId)) {
            throw new BadRequestException(
                    "Cannot delete department because it still has positions."
            );
        }

        if (employeeRepository.existsByDepartmentId(departmentId)) {
            throw new BadRequestException(
                    "Cannot delete department because it still has employees."
            );
        }
    }

    @Override
    public void validatePositionDeletion(Long positionId) {

        if (employeeRepository.existsByPositionId(positionId)) {
            throw new BadRequestException(
                    "Cannot delete position because it is assigned to employees."
            );
        }
    }

    @Override
    public void validateEmployeeDeletion(Long employeeId) {

        if (employeeRepository.existsByManagerId(employeeId)) {
            throw new BadRequestException(
                    "Cannot delete employee because they are assigned as a manager."
            );
        }
    }
}
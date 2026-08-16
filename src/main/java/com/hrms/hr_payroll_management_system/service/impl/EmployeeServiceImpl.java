package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;

import com.hrms.hr_payroll_management_system.dto.request.employee.AssignEmployeeOrganizationRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.ChangeEmployeeStatusRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.CreateEmployeeRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.UpdateEmployeeRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.UpsertEmergencyContactRequest;

import com.hrms.hr_payroll_management_system.dto.response.employee.EmergencyContactResponse;
import com.hrms.hr_payroll_management_system.dto.response.employee.EmployeeResponse;

import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.EmergencyContact;
import com.hrms.hr_payroll_management_system.entity.Position;

import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.EmploymentType;

import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;

import com.hrms.hr_payroll_management_system.mapper.EmployeeMapper;

import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.EmergencyContactRepository;
import com.hrms.hr_payroll_management_system.repository.PositionRepository;

import com.hrms.hr_payroll_management_system.repository.specification.EmployeeSpecification;

import com.hrms.hr_payroll_management_system.service.EmployeeService;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final EmployeeMapper employeeMapper;
    private final EmergencyContactRepository emergencyContactRepository;
    private final CompanyRepository companyRepository;
    private final BranchRepository branchRepository;
    private final OrganizationIntegrityService organizationIntegrityService;

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    public EmployeeResponse create(CreateEmployeeRequest request) {

        if (employeeRepository.existsByEmployeeCode(
                request.getEmployeeCode()
        )) {
            throw new DuplicateResourceException(
                    "Employee code already exists."
            );
        }

        if (employeeRepository.existsByEmail(
                request.getEmail()
        )) {
            throw new DuplicateResourceException(
                    "Employee email already exists."
            );
        }

        Employee employee =
                employeeMapper.toEntity(request);

        Employee savedEmployee =
                employeeRepository.save(employee);

        return employeeMapper.toResponse(savedEmployee);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {

        Employee employee = getEmployee(id);

        return employeeMapper.toResponse(employee);
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public PageResponse<EmployeeResponse> getAll(
            int page,
            int size,
            String keyword,
            Long departmentId,
            Long positionId,
            EmploymentType employmentType,
            EmployeeStatus status,
            String sortBy,
            String direction
    ) {

        Sort sort =
                direction.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(page, size, sort);

        Specification<Employee> specification =
                Specification
                        .where(
                                EmployeeSpecification
                                        .hasKeyword(keyword)
                        )
                        .and(
                                EmployeeSpecification
                                        .hasDepartment(departmentId)
                        )
                        .and(
                                EmployeeSpecification
                                        .hasPosition(positionId)
                        )
                        .and(
                                EmployeeSpecification
                                        .hasEmploymentType(
                                                employmentType
                                        )
                        )
                        .and(
                                EmployeeSpecification
                                        .hasStatus(status)
                        );

        Page<Employee> employeePage =
                employeeRepository.findAll(
                        specification,
                        pageable
                );

        return PageResponse.<EmployeeResponse>builder()
                .content(
                        employeePage.getContent()
                                .stream()
                                .map(employeeMapper::toResponse)
                                .toList()
                )
                .page(employeePage.getNumber())
                .size(employeePage.getSize())
                .totalElements(
                        employeePage.getTotalElements()
                )
                .totalPages(
                        employeePage.getTotalPages()
                )
                .first(employeePage.isFirst())
                .last(employeePage.isLast())
                .build();
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public EmployeeResponse update(
            Long id,
            UpdateEmployeeRequest request
    ) {

        Employee employee = getEmployee(id);

        if (!employee.getEmployeeCode()
                .equals(request.getEmployeeCode())
                && employeeRepository.existsByEmployeeCode(
                        request.getEmployeeCode()
                )) {

            throw new DuplicateResourceException(
                    "Employee code already exists."
            );
        }

        if (!employee.getEmail()
                .equalsIgnoreCase(request.getEmail())
                && employeeRepository.existsByEmail(
                        request.getEmail()
                )) {

            throw new DuplicateResourceException(
                    "Employee email already exists."
            );
        }

        employeeMapper.updateEntity(
                request,
                employee
        );

        Employee updatedEmployee =
                employeeRepository.save(employee);

        return employeeMapper.toResponse(
                updatedEmployee
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public void delete(Long id) {

        Employee employee = getEmployee(id);

        organizationIntegrityService
                .validateEmployeeDeletion(id);

        employeeRepository.delete(employee);
    }

    // =========================================================
    // EMERGENCY CONTACT - SAVE / UPDATE
    // =========================================================

    @Override
    public EmergencyContactResponse saveEmergencyContact(
            Long employeeId,
            UpsertEmergencyContactRequest request
    ) {

        Employee employee = getEmployee(employeeId);

        EmergencyContact contact =
                emergencyContactRepository
                        .findByEmployeeId(employeeId)
                        .orElse(
                                EmergencyContact.builder()
                                        .employee(employee)
                                        .build()
                        );

        contact.setContactName(
                request.getContactName()
        );

        contact.setRelationship(
                request.getRelationship()
        );

        contact.setPhone(
                request.getPhone()
        );

        contact.setEmail(
                request.getEmail()
        );

        contact.setAddress(
                request.getAddress()
        );

        EmergencyContact saved =
                emergencyContactRepository.save(contact);

        return mapEmergencyContact(saved);
    }

    // =========================================================
    // EMERGENCY CONTACT - GET
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public EmergencyContactResponse getEmergencyContact(
            Long employeeId
    ) {

        getEmployee(employeeId);

        EmergencyContact contact =
                emergencyContactRepository
                        .findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Emergency contact not found."
                                )
                        );

        return mapEmergencyContact(contact);
    }

    // =========================================================
    // EMERGENCY CONTACT - DELETE
    // =========================================================

    @Override
    public void deleteEmergencyContact(
            Long employeeId
    ) {

        getEmployee(employeeId);

        EmergencyContact contact =
                emergencyContactRepository
                        .findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Emergency contact not found."
                                )
                        );

        emergencyContactRepository.delete(contact);
    }

    // =========================================================
    // EMERGENCY CONTACT MAPPER
    // =========================================================

    private EmergencyContactResponse mapEmergencyContact(
            EmergencyContact contact
    ) {

        return EmergencyContactResponse.builder()
                .id(contact.getId())
                .contactName(contact.getContactName())
                .relationship(contact.getRelationship())
                .phone(contact.getPhone())
                .email(contact.getEmail())
                .address(contact.getAddress())
                .build();
    }

    // =========================================================
    // CHANGE EMPLOYEE STATUS
    // =========================================================

    @Override
    public EmployeeResponse changeStatus(
            Long employeeId,
            ChangeEmployeeStatusRequest request
    ) {

        Employee employee = getEmployee(employeeId);

        EmployeeStatus currentStatus =
                employee.getStatus();

        EmployeeStatus newStatus =
                request.getStatus();

        if (currentStatus == newStatus) {

            throw new BadRequestException(
                    "Employee already has status "
                            + newStatus
                            + "."
            );
        }

        validateStatusTransition(
                currentStatus,
                newStatus
        );

        employee.setStatus(newStatus);

        employee.setStatusEffectiveDate(
                request.getEffectiveDate()
        );

        employee.setStatusReason(
                request.getReason()
        );

        if (newStatus == EmployeeStatus.RESIGNED
                || newStatus == EmployeeStatus.TERMINATED) {

            employee.setSeparationDate(
                    request.getEffectiveDate()
            );

        } else {

            employee.setSeparationDate(null);
        }

        Employee savedEmployee =
                employeeRepository.save(employee);

        return employeeMapper.toResponse(
                savedEmployee
        );
    }

    // =========================================================
    // STATUS TRANSITION VALIDATION
    // =========================================================

    private void validateStatusTransition(
            EmployeeStatus currentStatus,
            EmployeeStatus newStatus
    ) {

        if (currentStatus == EmployeeStatus.RESIGNED) {

            throw new BadRequestException(
                    "Resigned employee status cannot be changed."
            );
        }

        if (currentStatus == EmployeeStatus.TERMINATED) {

            throw new BadRequestException(
                    "Terminated employee status cannot be changed."
            );
        }

        if (currentStatus == EmployeeStatus.SUSPENDED
                && newStatus == EmployeeStatus.RESIGNED) {

            return;
        }

        if (currentStatus == EmployeeStatus.SUSPENDED
                && newStatus == EmployeeStatus.ACTIVE) {

            return;
        }

        if (currentStatus == EmployeeStatus.INACTIVE
                && newStatus == EmployeeStatus.ACTIVE) {

            return;
        }

        if (newStatus == EmployeeStatus.INACTIVE
                || newStatus == EmployeeStatus.SUSPENDED
                || newStatus == EmployeeStatus.RESIGNED
                || newStatus == EmployeeStatus.TERMINATED) {

            return;
        }

        throw new BadRequestException(
                "Invalid employee status transition from "
                        + currentStatus
                        + " to "
                        + newStatus
                        + "."
        );
    }

    // =========================================================
    // ASSIGN ORGANIZATION
    // =========================================================

    @Override
    public EmployeeResponse assignOrganization(
            Long employeeId,
            AssignEmployeeOrganizationRequest request
    ) {

        Employee employee = getEmployee(employeeId);

        Company company =
                companyRepository
                        .findById(request.getCompanyId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found."
                                )
                        );

        Branch branch =
                branchRepository
                        .findById(request.getBranchId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Branch not found."
                                )
                        );

        Department department =
                departmentRepository
                        .findById(
                                request.getDepartmentId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found."
                                )
                        );

        Position position =
                positionRepository
                        .findById(
                                request.getPositionId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Position not found."
                                )
                        );

        // -----------------------------------------------------
        // Branch must belong to Company
        // -----------------------------------------------------

        if (branch.getCompany() == null
                || !branch.getCompany()
                        .getId()
                        .equals(company.getId())) {

            throw new BadRequestException(
                    "Branch does not belong to the selected company."
            );
        }

        // -----------------------------------------------------
        // Department must belong to Company
        // -----------------------------------------------------

        if (department.getCompany() == null
                || !department.getCompany()
                        .getId()
                        .equals(company.getId())) {

            throw new BadRequestException(
                    "Department does not belong to the selected company."
            );
        }

        // -----------------------------------------------------
        // Department must belong to Branch
        // -----------------------------------------------------

        if (department.getBranch() == null
                || !department.getBranch()
                        .getId()
                        .equals(branch.getId())) {

            throw new BadRequestException(
                    "Department does not belong to the selected branch."
            );
        }

        // -----------------------------------------------------
        // Position must belong to Company
        // -----------------------------------------------------

        if (position.getCompany() == null
                || !position.getCompany()
                        .getId()
                        .equals(company.getId())) {

            throw new BadRequestException(
                    "Position does not belong to the selected company."
            );
        }

        // -----------------------------------------------------
        // Position must belong to Branch
        // -----------------------------------------------------

        if (position.getBranch() == null
                || !position.getBranch()
                        .getId()
                        .equals(branch.getId())) {

            throw new BadRequestException(
                    "Position does not belong to the selected branch."
            );
        }

        // -----------------------------------------------------
        // Position must belong to Department
        // -----------------------------------------------------

        if (position.getDepartment() == null
                || !position.getDepartment()
                        .getId()
                        .equals(department.getId())) {

            throw new BadRequestException(
                    "Position does not belong to the selected department."
            );
        }

        // -----------------------------------------------------
        // Manager
        // -----------------------------------------------------

        Employee manager = null;

        if (request.getManagerId() != null) {

            if (employeeId.equals(
                    request.getManagerId()
            )) {

                throw new BadRequestException(
                        "Employee cannot be their own manager."
                );
            }

            manager =
                    employeeRepository
                            .findById(
                                    request.getManagerId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Manager not found."
                                    )
                            );

            // Manager must belong to same company
            if (manager.getCompany() == null
                    || !manager.getCompany()
                            .getId()
                            .equals(company.getId())) {

                throw new BadRequestException(
                        "Manager must belong to the same company."
                );
            }
        }

        // -----------------------------------------------------
        // Set organization
        // -----------------------------------------------------

        employee.setCompany(company);
        employee.setBranch(branch);
        employee.setDepartment(department);
        employee.setPosition(position);
        employee.setManager(manager);

        Employee savedEmployee =
                employeeRepository.save(employee);

        return employeeMapper.toResponse(
                savedEmployee
        );
    }

    // =========================================================
    // COMMON EMPLOYEE LOOKUP
    // =========================================================

    private Employee getEmployee(Long id) {

        return employeeRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found."
                        )
                );
    }
}
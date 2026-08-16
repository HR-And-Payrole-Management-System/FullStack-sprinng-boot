package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;

import com.hrms.hr_payroll_management_system.dto.request.employee.AssignEmployeeOrganizationRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.ChangeEmployeeStatusRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.CreateEmployeeRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.UpdateEmployeeRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.UpsertEmergencyContactRequest;

import com.hrms.hr_payroll_management_system.dto.response.employee.EmployeeResponse;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.EmploymentType;
import com.hrms.hr_payroll_management_system.dto.response.employee.EmergencyContactResponse;

public interface EmployeeService {

    EmployeeResponse create(
            CreateEmployeeRequest request
    );

    EmployeeResponse getById(Long id);

        PageResponse<EmployeeResponse> getAll(
                int page,
                int size,
                String keyword,
                Long departmentId,
                Long positionId,
                EmploymentType employmentType,
                EmployeeStatus status,
                String sortBy,
                String direction
        );

    EmployeeResponse update(
            Long id,
            UpdateEmployeeRequest request
    );

    EmployeeResponse assignOrganization(
            Long employeeId,
            AssignEmployeeOrganizationRequest request
    );

    EmployeeResponse changeStatus(
            Long employeeId,
            ChangeEmployeeStatusRequest request
    );

    EmergencyContactResponse saveEmergencyContact(
            Long employeeId,
            UpsertEmergencyContactRequest request
    );

    EmergencyContactResponse getEmergencyContact(
            Long employeeId
    );

    void deleteEmergencyContact(
            Long employeeId
    );

    void delete(Long id);
}
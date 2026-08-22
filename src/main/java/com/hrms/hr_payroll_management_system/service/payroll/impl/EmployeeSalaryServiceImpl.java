package com.hrms.hr_payroll_management_system.service.payroll.impl;

import com.hrms.hr_payroll_management_system.dto.request.payroll.AssignEmployeeSalaryRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.EmployeeSalaryResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.payroll.EmployeeSalary;
import com.hrms.hr_payroll_management_system.entity.payroll.SalaryStructure;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.EmployeeSalaryRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.SalaryStructureRepository;
import com.hrms.hr_payroll_management_system.service.payroll.EmployeeSalaryService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeSalaryServiceImpl
        implements EmployeeSalaryService {

    private final EmployeeSalaryRepository employeeSalaryRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryStructureRepository salaryStructureRepository;

    @Override
    public EmployeeSalaryResponse assign(
            Long employeeId,
            AssignEmployeeSalaryRequest request
    ) {

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found."
                                )
                        );

        SalaryStructure salaryStructure =
                salaryStructureRepository
                        .findById(request.getSalaryStructureId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Salary structure not found."
                                )
                        );

        EmployeeSalary employeeSalary =
                EmployeeSalary.builder()
                        .employee(employee)
                        .salaryStructure(salaryStructure)
                        .effectiveDate(request.getEffectiveDate())
                        .endDate(request.getEndDate())
                        .build();

        EmployeeSalary saved =
                employeeSalaryRepository.save(employeeSalary);

        return mapResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeSalaryResponse> getByEmployeeId(
            Long employeeId
    ) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException(
                    "Employee not found."
            );
        }

        return employeeSalaryRepository
                .findAll()
                .stream()
                .filter(s ->
                        s.getEmployee()
                                .getId()
                                .equals(employeeId)
                )
                .map(this::mapResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {

        EmployeeSalary employeeSalary =
                employeeSalaryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee salary assignment not found."
                                )
                        );

        employeeSalaryRepository.delete(employeeSalary);
    }

    private EmployeeSalaryResponse mapResponse(
            EmployeeSalary entity
    ) {

        return EmployeeSalaryResponse.builder()
                .id(entity.getId())
                .employeeId(
                        entity.getEmployee().getId()
                )
                .employeeCode(
                        entity.getEmployee()
                                .getEmployeeCode()
                )
                .salaryStructureId(
                        entity.getSalaryStructure()
                                .getId()
                )
                .salaryStructureName(
                        entity.getSalaryStructure()
                                .getName()
                )
                .basicSalary(
                        entity.getSalaryStructure()
                                .getBasicSalary()
                )
                .effectiveDate(
                        entity.getEffectiveDate()
                )
                .endDate(
                        entity.getEndDate()
                )
                .build();
    }
}
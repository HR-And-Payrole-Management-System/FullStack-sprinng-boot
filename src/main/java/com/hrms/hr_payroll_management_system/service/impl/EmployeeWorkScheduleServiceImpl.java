package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.schedule.AssignWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.response.schedule.EmployeeWorkScheduleResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.EmployeeWorkSchedule;
import com.hrms.hr_payroll_management_system.entity.WorkSchedule;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeWorkScheduleRepository;
import com.hrms.hr_payroll_management_system.repository.WorkScheduleRepository;
import com.hrms.hr_payroll_management_system.service.EmployeeWorkScheduleService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeWorkScheduleServiceImpl
        implements EmployeeWorkScheduleService {

    private final EmployeeWorkScheduleRepository employeeWorkScheduleRepository;
    private final EmployeeRepository employeeRepository;
    private final WorkScheduleRepository workScheduleRepository;

    @Override
    public EmployeeWorkScheduleResponse assign(
            Long employeeId,
            AssignWorkScheduleRequest request
    ) {

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found."
                                )
                        );

        WorkSchedule workSchedule =
                workScheduleRepository
                        .findById(request.getWorkScheduleId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Work schedule not found."
                                )
                        );

        boolean overlapping =
                employeeWorkScheduleRepository
                        .existsOverlappingSchedule(
                                employeeId,
                                request.getEffectiveDate(),
                                request.getEndDate()
                        );

        if (overlapping) {
            throw new BadRequestException(
                    "Employee already has a work schedule in this date range."
            );
        }

        EmployeeWorkSchedule assignment =
                EmployeeWorkSchedule.builder()
                        .employee(employee)
                        .workSchedule(workSchedule)
                        .effectiveDate(
                                request.getEffectiveDate()
                        )
                        .endDate(
                                request.getEndDate()
                        )
                        .build();

        EmployeeWorkSchedule saved =
                employeeWorkScheduleRepository.save(
                        assignment
                );

        return mapResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeWorkScheduleResponse> getByEmployeeId(
            Long employeeId
    ) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException(
                    "Employee not found."
            );
        }

        return employeeWorkScheduleRepository
                .findByEmployeeIdOrderByEffectiveDateDesc(
                        employeeId
                )
                .stream()
                .map(this::mapResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {

        EmployeeWorkSchedule assignment =
                employeeWorkScheduleRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee work schedule assignment not found."
                                )
                        );

        employeeWorkScheduleRepository.delete(
                assignment
        );
    }

    private EmployeeWorkScheduleResponse mapResponse(
            EmployeeWorkSchedule assignment
    ) {

        Employee employee =
                assignment.getEmployee();

        WorkSchedule schedule =
                assignment.getWorkSchedule();

        return EmployeeWorkScheduleResponse.builder()
                .id(assignment.getId())
                .employeeId(employee.getId())
                .employeeCode(
                        employee.getEmployeeCode()
                )
                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )
                .workScheduleId(
                        schedule.getId()
                )
                .workScheduleName(
                        schedule.getName()
                )
                .effectiveDate(
                        assignment.getEffectiveDate()
                )
                .endDate(
                        assignment.getEndDate()
                )
                .build();
    }
}
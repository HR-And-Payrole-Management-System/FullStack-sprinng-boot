package com.hrms.hr_payroll_management_system.service.performance.impl;

import com.hrms.hr_payroll_management_system.dto.request.performance.CreatePerformanceGoalRequest;
import com.hrms.hr_payroll_management_system.dto.request.performance.UpdateGoalProgressRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceGoalResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.performance.PerformanceCycle;
import com.hrms.hr_payroll_management_system.entity.performance.PerformanceGoal;
import com.hrms.hr_payroll_management_system.enums.PerformanceCycleStatus;
import com.hrms.hr_payroll_management_system.enums.PerformanceGoalStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.performance.PerformanceCycleRepository;
import com.hrms.hr_payroll_management_system.repository.performance.PerformanceGoalRepository;
import com.hrms.hr_payroll_management_system.service.performance.PerformanceGoalService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceGoalServiceImpl
        implements PerformanceGoalService {

    private final PerformanceGoalRepository goalRepository;
    private final PerformanceCycleRepository cycleRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public PerformanceGoalResponse create(
            Long employeeId,
            CreatePerformanceGoalRequest request
    ) {

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found."
                                )
                        );

        PerformanceCycle cycle =
                cycleRepository
                        .findById(request.getCycleId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Performance cycle not found."
                                )
                        );

        if (cycle.getStatus()
                == PerformanceCycleStatus.CLOSED) {

            throw new BadRequestException(
                    "Cannot create goal in closed cycle."
            );
        }

        PerformanceGoal goal =
                PerformanceGoal.builder()
                        .employee(employee)
                        .cycle(cycle)
                        .title(request.getTitle())
                        .description(
                                request.getDescription()
                        )
                        .weight(request.getWeight())
                        .progress(BigDecimal.ZERO)
                        .targetDate(
                                request.getTargetDate()
                        )
                        .status(
                                PerformanceGoalStatus.NOT_STARTED
                        )
                        .build();

        return map(goalRepository.save(goal));
    }

    @Override
    public PerformanceGoalResponse updateProgress(
            Long id,
            UpdateGoalProgressRequest request
    ) {

        PerformanceGoal goal =
                getGoal(id);

        if (goal.getCycle().getStatus()
                == PerformanceCycleStatus.CLOSED) {

            throw new BadRequestException(
                    "Cannot update goal in closed cycle."
            );
        }

        BigDecimal progress =
                request.getProgress();

        goal.setProgress(progress);

        if (progress.compareTo(
                BigDecimal.ZERO
        ) == 0) {

            goal.setStatus(
                    PerformanceGoalStatus.NOT_STARTED
            );

        } else if (progress.compareTo(
                BigDecimal.valueOf(100)
        ) >= 0) {

            goal.setProgress(
                    BigDecimal.valueOf(100)
            );

            goal.setStatus(
                    PerformanceGoalStatus.COMPLETED
            );

        } else {

            goal.setStatus(
                    PerformanceGoalStatus.IN_PROGRESS
            );
        }

        return map(goalRepository.save(goal));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerformanceGoalResponse> getEmployeeGoals(
            Long employeeId,
            Long cycleId
    ) {

        return goalRepository
                .findByEmployeeIdAndCycleId(
                        employeeId,
                        cycleId
                )
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public void delete(Long id) {

        PerformanceGoal goal =
                getGoal(id);

        if (goal.getCycle().getStatus()
                == PerformanceCycleStatus.CLOSED) {

            throw new BadRequestException(
                    "Cannot delete goal from closed cycle."
            );
        }

        goalRepository.delete(goal);
    }

    private PerformanceGoal getGoal(Long id) {

        return goalRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Performance goal not found."
                        )
                );
    }

    private PerformanceGoalResponse map(
            PerformanceGoal goal
    ) {

        Employee employee =
                goal.getEmployee();

        return PerformanceGoalResponse.builder()
                .id(goal.getId())
                .employeeId(employee.getId())
                .employeeCode(
                        employee.getEmployeeCode()
                )
                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )
                .cycleId(
                        goal.getCycle().getId()
                )
                .cycleName(
                        goal.getCycle().getName()
                )
                .title(goal.getTitle())
                .description(
                        goal.getDescription()
                )
                .weight(goal.getWeight())
                .progress(goal.getProgress())
                .targetDate(goal.getTargetDate())
                .status(goal.getStatus().name())
                .build();
    }
}
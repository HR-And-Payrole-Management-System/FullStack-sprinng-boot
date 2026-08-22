package com.hrms.hr_payroll_management_system.service.performance.impl;

import com.hrms.hr_payroll_management_system.dto.request.performance.CreatePerformanceCycleRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceCycleResponse;
import com.hrms.hr_payroll_management_system.entity.performance.PerformanceCycle;
import com.hrms.hr_payroll_management_system.enums.PerformanceCycleStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.performance.PerformanceCycleRepository;
import com.hrms.hr_payroll_management_system.service.performance.PerformanceCycleService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceCycleServiceImpl
        implements PerformanceCycleService {

    private final PerformanceCycleRepository repository;

    @Override
    public PerformanceCycleResponse create(
            CreatePerformanceCycleRequest request
    ) {

        if (repository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Performance cycle already exists."
            );
        }

        PerformanceCycle cycle =
                PerformanceCycle.builder()
                        .name(request.getName())
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .description(request.getDescription())
                        .status(
                                PerformanceCycleStatus.DRAFT
                        )
                        .build();

        return map(repository.save(cycle));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerformanceCycleResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PerformanceCycleResponse getById(Long id) {

        return map(getCycle(id));
    }

    @Override
    public PerformanceCycleResponse activate(Long id) {

        PerformanceCycle cycle =
                getCycle(id);

        if (cycle.getStatus()
                != PerformanceCycleStatus.DRAFT) {

            throw new BadRequestException(
                    "Only draft cycle can be activated."
            );
        }

        cycle.setStatus(
                PerformanceCycleStatus.ACTIVE
        );

        return map(repository.save(cycle));
    }

    @Override
    public PerformanceCycleResponse close(Long id) {

        PerformanceCycle cycle =
                getCycle(id);

        if (cycle.getStatus()
                != PerformanceCycleStatus.ACTIVE) {

            throw new BadRequestException(
                    "Only active cycle can be closed."
            );
        }

        cycle.setStatus(
                PerformanceCycleStatus.CLOSED
        );

        return map(repository.save(cycle));
    }

    @Override
    public void delete(Long id) {

        PerformanceCycle cycle =
                getCycle(id);

        if (cycle.getStatus()
                != PerformanceCycleStatus.DRAFT) {

            throw new BadRequestException(
                    "Only draft cycle can be deleted."
            );
        }

        repository.delete(cycle);
    }

    private PerformanceCycle getCycle(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Performance cycle not found."
                        )
                );
    }

    private PerformanceCycleResponse map(
            PerformanceCycle cycle
    ) {

        return PerformanceCycleResponse.builder()
                .id(cycle.getId())
                .name(cycle.getName())
                .startDate(cycle.getStartDate())
                .endDate(cycle.getEndDate())
                .description(cycle.getDescription())
                .status(cycle.getStatus().name())
                .build();
    }
}
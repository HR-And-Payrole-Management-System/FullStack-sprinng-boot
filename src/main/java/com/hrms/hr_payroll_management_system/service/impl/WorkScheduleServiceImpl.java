package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.schedule.CreateWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.request.schedule.UpdateWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.response.schedule.WorkScheduleResponse;
import com.hrms.hr_payroll_management_system.entity.WorkSchedule;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.WorkScheduleMapper;
import com.hrms.hr_payroll_management_system.repository.WorkScheduleRepository;
import com.hrms.hr_payroll_management_system.service.WorkScheduleService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkScheduleServiceImpl
        implements WorkScheduleService {

    private final WorkScheduleRepository workScheduleRepository;
    private final WorkScheduleMapper workScheduleMapper;

    @Override
    public WorkScheduleResponse create(
            CreateWorkScheduleRequest request
    ) {

        validateTimes(
                request.getStartTime(),
                request.getEndTime()
        );

        if (workScheduleRepository.existsByName(
                request.getName()
        )) {
            throw new DuplicateResourceException(
                    "Work schedule name already exists."
            );
        }

        WorkSchedule schedule =
                workScheduleMapper.toEntity(request);

        WorkSchedule saved =
                workScheduleRepository.save(schedule);

        return workScheduleMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkScheduleResponse> getAll() {

        return workScheduleRepository.findAll()
                .stream()
                .map(workScheduleMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public WorkScheduleResponse getById(Long id) {

        return workScheduleMapper.toResponse(
                getSchedule(id)
        );
    }

    @Override
    public WorkScheduleResponse update(
            Long id,
            UpdateWorkScheduleRequest request
    ) {

        WorkSchedule schedule =
                getSchedule(id);

        validateTimes(
                request.getStartTime(),
                request.getEndTime()
        );

        if (!schedule.getName()
                .equalsIgnoreCase(request.getName())
                && workScheduleRepository.existsByName(
                        request.getName()
                )) {

            throw new DuplicateResourceException(
                    "Work schedule name already exists."
            );
        }

        workScheduleMapper.updateEntity(
                request,
                schedule
        );

        WorkSchedule updated =
                workScheduleRepository.save(schedule);

        return workScheduleMapper.toResponse(updated);
    }

    @Override
    public void delete(Long id) {

        WorkSchedule schedule =
                getSchedule(id);

        workScheduleRepository.delete(schedule);
    }

    private WorkSchedule getSchedule(Long id) {

        return workScheduleRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Work schedule not found."
                        )
                );
    }

    private void validateTimes(
            java.time.LocalTime startTime,
            java.time.LocalTime endTime
    ) {

        if (startTime.equals(endTime)) {
            throw new BadRequestException(
                    "Start time and end time cannot be the same."
            );
        }
    }
}
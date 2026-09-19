package com.hrms.hr_payroll_management_system.service.okr.impl;

import com.hrms.hr_payroll_management_system.dto.request.okr.CreateOkrCycleRequest;
import com.hrms.hr_payroll_management_system.dto.response.okr.OkrCycleResponse;
import com.hrms.hr_payroll_management_system.entity.okr.OkrCycle;
import com.hrms.hr_payroll_management_system.enums.OkrCycleStatus;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.okr.OkrCycleRepository;
import com.hrms.hr_payroll_management_system.service.okr.OkrCycleService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OkrCycleServiceImpl implements OkrCycleService {

    private final OkrCycleRepository okrCycleRepository;

    @Override
    @Transactional
    public OkrCycleResponse create(CreateOkrCycleRequest request) {
        OkrCycle cycle = OkrCycle.builder()
                .name(request.getName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(OkrCycleStatus.ACTIVE)
                .build();
        return toResponse(okrCycleRepository.save(cycle));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OkrCycleResponse> getAll() {
        return okrCycleRepository.findAll().stream()
                .sorted(Comparator.comparing(OkrCycle::getStartDate).reversed())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OkrCycleResponse close(Long id) {
        OkrCycle cycle = okrCycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OKR cycle not found: " + id));
        cycle.setStatus(OkrCycleStatus.CLOSED);
        return toResponse(okrCycleRepository.save(cycle));
    }

    private OkrCycleResponse toResponse(OkrCycle c) {
        return OkrCycleResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .status(c.getStatus().name())
                .build();
    }
}
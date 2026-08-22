package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.leave.CreateLeaveTypeRequest;
import com.hrms.hr_payroll_management_system.dto.request.leave.UpdateLeaveTypeRequest;
import com.hrms.hr_payroll_management_system.dto.response.leave.LeaveTypeResponse;
import com.hrms.hr_payroll_management_system.entity.LeaveType;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.LeaveTypeMapper;
import com.hrms.hr_payroll_management_system.repository.LeaveTypeRepository;
import com.hrms.hr_payroll_management_system.service.LeaveTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveTypeServiceImpl implements LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveTypeMapper leaveTypeMapper;

    @Override
    public LeaveTypeResponse create(CreateLeaveTypeRequest request) {

        if (leaveTypeRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Leave type already exists."
            );
        }

        LeaveType entity =
                leaveTypeMapper.toEntity(request);

        return leaveTypeMapper.toResponse(
                leaveTypeRepository.save(entity)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveTypeResponse> getAll() {

        return leaveTypeRepository.findAll()
                .stream()
                .map(leaveTypeMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveTypeResponse getById(Long id) {

        return leaveTypeMapper.toResponse(
                getLeaveType(id)
        );
    }

    @Override
    public LeaveTypeResponse update(
            Long id,
            UpdateLeaveTypeRequest request
    ) {

        LeaveType leaveType = getLeaveType(id);

        if (!leaveType.getName()
                .equalsIgnoreCase(request.getName())
                && leaveTypeRepository.existsByName(
                        request.getName()
                )) {

            throw new DuplicateResourceException(
                    "Leave type already exists."
            );
        }

        leaveTypeMapper.updateEntity(
                request,
                leaveType
        );

        return leaveTypeMapper.toResponse(
                leaveTypeRepository.save(leaveType)
        );
    }

    @Override
    public void delete(Long id) {

        LeaveType leaveType = getLeaveType(id);

        leaveTypeRepository.delete(leaveType);
    }

    private LeaveType getLeaveType(Long id) {

        return leaveTypeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Leave type not found."
                        )
                );
    }
}
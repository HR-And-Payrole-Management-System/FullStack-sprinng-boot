package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.jobrole.CreateJobRoleRequest;
import com.hrms.hr_payroll_management_system.dto.request.jobrole.UpdateJobRoleRequest;
import com.hrms.hr_payroll_management_system.dto.response.jobrole.JobRoleResponse;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.JobRole;
import com.hrms.hr_payroll_management_system.enums.PositionLevel;
import com.hrms.hr_payroll_management_system.enums.Status;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.JobRoleMapper;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.JobRoleRepository;
import com.hrms.hr_payroll_management_system.service.JobRoleService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobRoleServiceImpl implements JobRoleService {

    private final JobRoleRepository jobRoleRepository;
    private final JobRoleMapper jobRoleMapper;
    private final DepartmentRepository departmentRepository;

    @Override
    public JobRoleResponse create(CreateJobRoleRequest request) {

        if (jobRoleRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Job role already exists."
            );
        }

        JobRole jobRole = jobRoleMapper.toEntity(request);

        jobRole.setLevel(parseLevel(request.getLevel()));
        jobRole.setDepartment(
                resolveDepartment(request.getDepartmentId())
        );
        jobRole.setStatus(Status.ACTIVE);

        return jobRoleMapper.toResponse(
                jobRoleRepository.save(jobRole)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobRoleResponse> getAll() {

        return jobRoleRepository.findAll()
                .stream()
                .map(jobRoleMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JobRoleResponse getById(Long id) {

        return jobRoleMapper.toResponse(getJobRole(id));
    }

    @Override
    public JobRoleResponse update(
            Long id,
            UpdateJobRoleRequest request
    ) {

        JobRole jobRole = getJobRole(id);

        if (!jobRole.getName().equals(request.getName())
                && jobRoleRepository.existsByName(request.getName())) {

            throw new DuplicateResourceException(
                    "Job role already exists."
            );
        }

        jobRoleMapper.updateEntity(request, jobRole);

        jobRole.setLevel(parseLevel(request.getLevel()));
        jobRole.setDepartment(
                resolveDepartment(request.getDepartmentId())
        );

        if (request.getStatus() != null
                && !request.getStatus().isBlank()) {
            jobRole.setStatus(parseStatus(request.getStatus()));
        }

        return jobRoleMapper.toResponse(
                jobRoleRepository.save(jobRole)
        );
    }

    @Override
    public void delete(Long id) {

        JobRole jobRole = getJobRole(id);

        jobRoleRepository.delete(jobRole);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobRoleResponse> getByDepartmentId(Long departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException(
                    "Department not found."
            );
        }

        return jobRoleRepository.findByDepartmentId(departmentId)
                .stream()
                .map(jobRoleMapper::toResponse)
                .toList();
    }

    private JobRole getJobRole(Long id) {

        return jobRoleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job role not found."
                        )
                );
    }

    private Department resolveDepartment(Long departmentId) {

        if (departmentId == null) {
            return null;
        }

        return departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found."
                        )
                );
    }

    private PositionLevel parseLevel(String level) {

        if (level == null || level.isBlank()) {
            return null;
        }

        try {
            return PositionLevel.valueOf(level.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(
                    "Invalid job role level: " + level
            );
        }
    }

    private Status parseStatus(String status) {

        try {
            return Status.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(
                    "Invalid status: " + status
            );
        }
    }
}
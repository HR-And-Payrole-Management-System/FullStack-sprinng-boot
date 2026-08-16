package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.permission.CreatePermissionRequest;
import com.hrms.hr_payroll_management_system.dto.request.permission.UpdatePermissionRequest;
import com.hrms.hr_payroll_management_system.dto.response.permission.PermissionResponse;
import com.hrms.hr_payroll_management_system.entity.Permission;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.PermissionMapper;
import com.hrms.hr_payroll_management_system.repository.PermissionRepository;
import com.hrms.hr_payroll_management_system.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    @Override
    public PermissionResponse create(CreatePermissionRequest request) {

        if (permissionRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Permission already exists.");
        }

        Permission permission = permissionMapper.toEntity(request);

        Permission savedPermission = permissionRepository.save(permission);

        return permissionMapper.toResponse(savedPermission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAll() {

        return permissionRepository.findAll()
                .stream()
                .map(permissionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionResponse getById(Long id) {

        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Permission not found."));

        return permissionMapper.toResponse(permission);
    }

    @Override
    public PermissionResponse update(Long id, UpdatePermissionRequest request) {

        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Permission not found."));

        if (!permission.getName().equals(request.getName())
                && permissionRepository.existsByName(request.getName())) {

            throw new DuplicateResourceException("Permission already exists.");
        }

        permissionMapper.updateEntity(request, permission);

        Permission updatedPermission = permissionRepository.save(permission);

        return permissionMapper.toResponse(updatedPermission);
    }

    @Override
    public void delete(Long id) {

        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Permission not found."));

        permissionRepository.delete(permission);
    }

}
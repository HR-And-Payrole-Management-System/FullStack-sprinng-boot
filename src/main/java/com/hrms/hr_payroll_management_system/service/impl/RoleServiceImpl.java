package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.role.CreateRoleRequest;
import com.hrms.hr_payroll_management_system.dto.request.role.UpdateRoleRequest;
import com.hrms.hr_payroll_management_system.dto.response.role.RoleResponse;
import com.hrms.hr_payroll_management_system.entity.Role;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.RoleMapper;
import com.hrms.hr_payroll_management_system.repository.RoleRepository;
import com.hrms.hr_payroll_management_system.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hrms.hr_payroll_management_system.dto.request.role.AssignPermissionsRequest;
import com.hrms.hr_payroll_management_system.entity.Permission;
import com.hrms.hr_payroll_management_system.repository.PermissionRepository;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;
    private final PermissionRepository permissionRepository;

    @Override
    public RoleResponse create(CreateRoleRequest request) {

        if (roleRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Role already exists.");
        }

        Role role = roleMapper.toEntity(request);

        Role savedRole = roleRepository.save(role);

        return roleMapper.toResponse(savedRole);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<RoleResponse> getAll(
            int page,
            int size,
            String keyword,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Role> rolePage;

        if (keyword == null || keyword.isBlank()) {
            rolePage = roleRepository.findAll(pageable);
        } else {
            rolePage = roleRepository.findByNameContainingIgnoreCase(
                    keyword,
                    pageable
            );
        }

        return PageResponse.<RoleResponse>builder()
                .content(
                        rolePage.getContent()
                                .stream()
                                .map(roleMapper::toResponse)
                                .toList()
                )
                .page(rolePage.getNumber())
                .size(rolePage.getSize())
                .totalElements(rolePage.getTotalElements())
                .totalPages(rolePage.getTotalPages())
                .first(rolePage.isFirst())
                .last(rolePage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getById(Long id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found."));

        return roleMapper.toResponse(role);
    }

    @Override
    public RoleResponse update(
            Long id,
            UpdateRoleRequest request
    ) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found."));

        if (!role.getName().equals(request.getName())
                && roleRepository.existsByName(request.getName())) {

            throw new DuplicateResourceException("Role already exists.");
        }

        roleMapper.updateEntity(request, role);

        Role updatedRole = roleRepository.save(role);

        return roleMapper.toResponse(updatedRole);
    }

    @Override
    public void delete(Long id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found."));

        roleRepository.delete(role);
    }
    @Override
    public RoleResponse assignPermissions(
            Long roleId,
            AssignPermissionsRequest request
    ) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found.")
                );

        Set<Permission> permissions = new HashSet<>(
                permissionRepository.findAllById(
                        request.getPermissionIds()
                )
        );

        if (permissions.size() != request.getPermissionIds().size()) {
            throw new ResourceNotFoundException(
                    "One or more permissions were not found."
            );
        }

        role.getPermissions().addAll(permissions);

        Role savedRole = roleRepository.save(role);

        return roleMapper.toResponse(savedRole);
    }

    @Override
    public RoleResponse removePermission(
            Long roleId,
            Long permissionId
    ) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found.")
                );

        Permission permission =
                permissionRepository.findById(permissionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Permission not found."
                                )
                        );

        boolean removed = role.getPermissions().remove(permission);

        if (!removed) {
            throw new BadRequestException(
                    "Permission is not assigned to this role."
            );
        }

        Role savedRole = roleRepository.save(role);

        return roleMapper.toResponse(savedRole);
    }
}
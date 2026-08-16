package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.user.AssignRolesRequest;
import com.hrms.hr_payroll_management_system.dto.response.user.UserResponse;
import com.hrms.hr_payroll_management_system.entity.Role;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.UserMapper;
import com.hrms.hr_payroll_management_system.repository.RoleRepository;
import com.hrms.hr_payroll_management_system.repository.UserRepository;
import com.hrms.hr_payroll_management_system.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse assignRoles(
            Long userId,
            AssignRolesRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Set<Role> roles = new HashSet<>(
                roleRepository.findAllById(request.getRoleIds())
        );

        if (roles.size() != request.getRoleIds().size()) {
            throw new ResourceNotFoundException(
                    "One or more roles were not found."
            );
        }

        user.getRoles().addAll(roles);

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    @Override
    public UserResponse removeRole(
            Long userId,
            Long roleId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found.")
                );

        boolean removed = user.getRoles().remove(role);

        if (!removed) {
            throw new BadRequestException(
                    "Role is not assigned to this user."
            );
        }

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }
}
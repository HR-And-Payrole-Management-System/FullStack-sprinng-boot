package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.integration.ConnectIntegrationRequest;
import com.hrms.hr_payroll_management_system.dto.request.integration.CreateIntegrationRequest;
import com.hrms.hr_payroll_management_system.dto.response.integration.IntegrationResponse;
import com.hrms.hr_payroll_management_system.dto.response.integration.IntegrationSummaryResponse;
import com.hrms.hr_payroll_management_system.entity.Integration;
import com.hrms.hr_payroll_management_system.enums.IntegrationStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.IntegrationMapper;
import com.hrms.hr_payroll_management_system.repository.IntegrationRepository;
import com.hrms.hr_payroll_management_system.service.IntegrationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IntegrationServiceImpl implements IntegrationService {

    private final IntegrationRepository integrationRepository;
    private final IntegrationMapper integrationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<IntegrationResponse> getAll() {
        return integrationRepository.findAll()
                .stream()
                .map(integrationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public IntegrationSummaryResponse getSummary() {
        long total = integrationRepository.count();
        long connected = integrationRepository.countByStatus(IntegrationStatus.CONNECTED);
        return IntegrationSummaryResponse.builder()
                .total(total)
                .connected(connected)
                .disconnected(total - connected)
                .build();
    }

    @Override
    public IntegrationResponse create(CreateIntegrationRequest request) {
        if (integrationRepository.existsByProviderKey(request.getProviderKey())) {
            throw new BadRequestException("An integration with this provider key already exists.");
        }

        Integration integration = integrationMapper.toEntity(request);
        integration.setStatus(IntegrationStatus.DISCONNECTED);
        integration.setIsSystem(false); // custom, admin-added entries are deletable

        return integrationMapper.toResponse(integrationRepository.save(integration));
    }

    @Override
    public IntegrationResponse connect(Long id, ConnectIntegrationRequest request, String currentUsername) {
        Integration integration = getIntegration(id);

        if ((request.getApiKey() == null || request.getApiKey().isBlank())
                && (request.getWebhookUrl() == null || request.getWebhookUrl().isBlank())) {
            throw new BadRequestException("Provide an API key or a webhook URL to connect.");
        }

        integration.setApiKey(request.getApiKey());
        integration.setWebhookUrl(request.getWebhookUrl());
        integration.setStatus(IntegrationStatus.CONNECTED);
        integration.setConnectedAt(LocalDateTime.now());
        integration.setConnectedBy(currentUsername);

        return integrationMapper.toResponse(integrationRepository.save(integration));
    }

    @Override
    public IntegrationResponse disconnect(Long id) {
        Integration integration = getIntegration(id);

        integration.setStatus(IntegrationStatus.DISCONNECTED);
        integration.setApiKey(null);
        integration.setWebhookUrl(null);
        integration.setConnectedAt(null);
        integration.setConnectedBy(null);

        return integrationMapper.toResponse(integrationRepository.save(integration));
    }

    @Override
    public void delete(Long id) {
        Integration integration = getIntegration(id);

        if (Boolean.TRUE.equals(integration.getIsSystem())) {
            throw new BadRequestException("Built-in integrations cannot be deleted.");
        }

        integrationRepository.delete(integration);
    }

    private Integration getIntegration(Long id) {
        return integrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Integration not found."));
    }
}
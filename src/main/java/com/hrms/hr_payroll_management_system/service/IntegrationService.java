package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.integration.ConnectIntegrationRequest;
import com.hrms.hr_payroll_management_system.dto.request.integration.CreateIntegrationRequest;
import com.hrms.hr_payroll_management_system.dto.response.integration.IntegrationResponse;
import com.hrms.hr_payroll_management_system.dto.response.integration.IntegrationSummaryResponse;

import java.util.List;

public interface IntegrationService {
    List<IntegrationResponse> getAll();
    IntegrationSummaryResponse getSummary();
    IntegrationResponse create(CreateIntegrationRequest request);
    IntegrationResponse connect(Long id, ConnectIntegrationRequest request, String currentUsername);
    IntegrationResponse disconnect(Long id);
    void delete(Long id);
}
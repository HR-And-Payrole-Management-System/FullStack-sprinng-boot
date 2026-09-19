package com.hrms.hr_payroll_management_system.dto.request.integration;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ConnectIntegrationRequest {

    @Size(max = 255, message = "API key/token is too long.")
    private String apiKey;

    @Size(max = 500, message = "Webhook URL is too long.")
    private String webhookUrl;
}
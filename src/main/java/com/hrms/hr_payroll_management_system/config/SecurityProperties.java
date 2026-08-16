package com.hrms.hr_payroll_management_system.config;

import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    private int maxFailedAttempts = 5;

    private long lockDurationMinutes = 15;

    private long accessTokenExpirationSeconds = 3600;
}
package com.hrms.hr_payroll_management_system.config;

import com.hrms.hr_payroll_management_system.entity.Integration;
import com.hrms.hr_payroll_management_system.enums.IntegrationCategory;
import com.hrms.hr_payroll_management_system.enums.IntegrationStatus;
import com.hrms.hr_payroll_management_system.repository.IntegrationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(2) // after PermissionRoleSeeder
@RequiredArgsConstructor
public class IntegrationCatalogSeeder implements ApplicationRunner {

    private final IntegrationRepository integrationRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seed("SLACK", "Slack", "Send attendance and leave alerts to a Slack channel.", IntegrationCategory.COMMUNICATION, "MessageSquare");
        seed("MICROSOFT_TEAMS", "Microsoft Teams", "Post HR notifications into a Teams channel.", IntegrationCategory.COMMUNICATION, "Users");
        seed("ZOOM", "Zoom", "Schedule interviews and performance review calls.", IntegrationCategory.PRODUCTIVITY, "Video");
        seed("GOOGLE_WORKSPACE", "Google Workspace", "Sync employee accounts and shared calendars.", IntegrationCategory.PRODUCTIVITY, "Mail");
        seed("GITHUB", "GitHub", "Link engineering onboarding tasks to repositories.", IntegrationCategory.DEVELOPER_TOOLS, "Github");
        seed("STRIPE", "Stripe", "Sync payroll payouts with your payment provider.", IntegrationCategory.FINANCE, "CreditCard");
        seed("DROPBOX", "Dropbox", "Back up employee documents automatically.", IntegrationCategory.STORAGE, "HardDrive");
    }

    private void seed(String key, String name, String description, IntegrationCategory category, String iconKey) {
        if (integrationRepository.existsByProviderKey(key)) return;

        integrationRepository.save(
                Integration.builder()
                        .providerKey(key)
                        .displayName(name)
                        .description(description)
                        .category(category)
                        .iconKey(iconKey)
                        .status(IntegrationStatus.DISCONNECTED)
                        .isSystem(true)
                        .build()
        );
    }
}
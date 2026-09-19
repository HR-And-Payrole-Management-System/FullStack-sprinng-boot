package com.hrms.hr_payroll_management_system.config;

import com.hrms.hr_payroll_management_system.entity.Permission;
import com.hrms.hr_payroll_management_system.entity.Role;
import com.hrms.hr_payroll_management_system.enums.Status;
import com.hrms.hr_payroll_management_system.repository.IntegrationRepository;
import com.hrms.hr_payroll_management_system.repository.PermissionRepository;
import com.hrms.hr_payroll_management_system.repository.RoleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
@Order 
@RequiredArgsConstructor
public class PermissionRoleSeeder implements ApplicationRunner {

    private static final String ADMIN_ROLE_NAME = "ADMIN";

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final IntegrationRepository integrationRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {

        int created = 0;

        for (Map.Entry<String, String> entry : permissionCatalogue().entrySet()) {

            String name = entry.getKey();

            if (permissionRepository.existsByName(name)) {
                continue;
            }

            Permission permission =
                    Permission.builder()
                            .name(name)
                            .description(entry.getValue())
                            .status(Status.ACTIVE)
                            .build();

            permissionRepository.save(permission);
            created++;
        }

        if (created > 0) {
            log.info("Seeded {} missing permission(s).", created);
        }

        Role admin =
                roleRepository.findByName(ADMIN_ROLE_NAME)
                        .orElseGet(() -> {
                            Role role =
                                    Role.builder()
                                            .name(ADMIN_ROLE_NAME)
                                            .description(
                                                    "Full system access — automatically seeded on startup."
                                            )
                                            .status(Status.ACTIVE)
                                            .build();

                            Role saved = roleRepository.save(role);
                            log.info("Created default ADMIN role.");
                            return saved;
                        });

        var allPermissions = permissionRepository.findAll();

        boolean changed = admin.getPermissions().size() != allPermissions.size();

        admin.getPermissions().addAll(allPermissions);

        if (changed) {
            roleRepository.save(admin);
            log.info(
                    "ADMIN role now holds all {} permission(s).",
                    admin.getPermissions().size()
            );
        }
    }
    

    private Map<String, String> permissionCatalogue() {

        Map<String, String> permissions = new LinkedHashMap<>();

        addCrud(permissions, "COMPANY", "companies");
        addCrud(permissions, "BRANCH", "branches");
        addCrud(permissions, "DEPARTMENT", "departments");
        addCrud(permissions, "POSITION", "positions");
        addCrud(permissions, "JOB_ROLE", "job roles");
        addCrud(permissions, "LOCATION", "locations");
        permissions.put("ORGANIZATION_VIEW", "View organization structure");

        addCrud(permissions, "EMPLOYEE", "employees");

        permissions.put("IDCARD_VIEW", "View employee ID cards");
        permissions.put("IDCARD_MANAGE", "Issue, update, and revoke employee ID cards");

        permissions.put("ATTENDANCE_VIEW", "View attendance records");
        permissions.put("ATTENDANCE_CREATE", "Record attendance (check-in/out) for others");
        permissions.put("ATTENDANCE_ADJUST", "Adjust attendance records and manage the QR kiosk");
        addCrud(permissions, "SCHEDULE", "work schedules");
        addCrud(permissions, "HOLIDAY", "holidays");
        addCrud(permissions, "LEAVE_TYPE", "leave types");
        permissions.put("LEAVE_VIEW", "View leave requests");
        permissions.put("LEAVE_CREATE", "Submit leave requests");
        permissions.put("LEAVE_UPDATE", "Update leave requests");
        permissions.put("LEAVE_APPROVE", "Approve or reject leave requests");

        permissions.put("PAYROLL_VIEW", "View payroll records");
        permissions.put("PAYROLL_CREATE", "Create payroll runs");
        permissions.put("PAYROLL_UPDATE", "Update payroll records");
        permissions.put("PAYROLL_APPROVE", "Approve payroll runs");
        permissions.put("PAYROLL_PAY", "Mark payroll as paid");

        addCrud(permissions, "PERFORMANCE", "performance reviews");
        permissions.put("PERFORMANCE_REVIEW", "Conduct performance reviews");
        addCrud(permissions, "RECRUITMENT", "recruitment/job postings");
        addCrud(permissions, "TRAINING", "training programs");

        permissions.put("DOCUMENT_VIEW", "View documents");
        permissions.put("DOCUMENT_CREATE", "Upload documents");
        permissions.put("DOCUMENT_UPDATE", "Update documents");
        permissions.put("DOCUMENT_DELETE", "Delete documents");
        permissions.put("DOCUMENT_VERIFY", "Verify uploaded documents");
        permissions.put("DOCUMENT_MANAGE", "Full document management");

        permissions.put("MESSAGE_VIEW", "View messages");
        permissions.put("MESSAGE_SEND", "Send messages");
        permissions.put("MESSAGE_BROADCAST", "Broadcast messages/announcements");
        permissions.put("MESSAGE_DELETE", "Delete messages");
        addCrud(permissions, "NOTIFICATION", "notifications");
        permissions.put("INTEGRATION_VIEW", "View integrations");
        permissions.put("INTEGRATION_MANAGE", "Connect, disconnect, and manage integrations");
        permissions.put("BILLING_VIEW", "View billing and subscription details");
        permissions.put("BILLING_MANAGE", "Change plan, cancel subscription, manage billing");

        addCrud(permissions, "ROLE", "roles");
        addCrud(permissions, "PERMISSION", "permissions");
        permissions.put("ROLE_ASSIGN_PERMISSION", "Assign permissions to a role");
        permissions.put("USER_VIEW", "View user accounts");
        permissions.put("USER_ASSIGN_ROLE", "Assign a role to a user account");

        permissions.put("DASHBOARD_VIEW", "View dashboards");
        permissions.put("REPORT_VIEW", "View reports");
        permissions.put("ANALYTICS_VIEW", "View analytics");
        permissions.put("AUDIT_VIEW", "View audit logs");

        return permissions;
    }

    private void addCrud(Map<String, String> permissions, String prefix, String label) {
        permissions.put(prefix + "_VIEW", "View " + label);
        permissions.put(prefix + "_CREATE", "Create " + label);
        permissions.put(prefix + "_UPDATE", "Update " + label);
        permissions.put(prefix + "_DELETE", "Delete " + label);
    }
}
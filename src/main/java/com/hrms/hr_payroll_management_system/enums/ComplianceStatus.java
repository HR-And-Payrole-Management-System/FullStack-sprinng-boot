package com.hrms.hr_payroll_management_system.enums;

public enum ComplianceStatus {
    COMPLIANT,
    AT_RISK,      // document valid but expiring within 30 days
    NON_COMPLIANT // missing, expired, rejected, or training not completed
}
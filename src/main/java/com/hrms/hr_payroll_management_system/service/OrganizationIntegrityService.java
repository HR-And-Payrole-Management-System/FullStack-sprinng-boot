package com.hrms.hr_payroll_management_system.service;

public interface OrganizationIntegrityService {

    void validateCompanyDeletion(Long companyId);

    void validateBranchDeletion(Long branchId);

    void validateDepartmentDeletion(Long departmentId);

    void validatePositionDeletion(Long positionId);

    void validateEmployeeDeletion(Long employeeId);
}
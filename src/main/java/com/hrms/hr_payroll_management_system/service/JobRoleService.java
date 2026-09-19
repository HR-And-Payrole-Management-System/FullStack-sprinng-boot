package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.jobrole.CreateJobRoleRequest;
import com.hrms.hr_payroll_management_system.dto.request.jobrole.UpdateJobRoleRequest;
import com.hrms.hr_payroll_management_system.dto.response.jobrole.JobRoleResponse;

import java.util.List;

public interface JobRoleService {

    JobRoleResponse create(CreateJobRoleRequest request);

    List<JobRoleResponse> getAll();

    JobRoleResponse getById(Long id);

    JobRoleResponse update(
            Long id,
            UpdateJobRoleRequest request
    );

    void delete(Long id);

    List<JobRoleResponse> getByDepartmentId(Long departmentId);
}
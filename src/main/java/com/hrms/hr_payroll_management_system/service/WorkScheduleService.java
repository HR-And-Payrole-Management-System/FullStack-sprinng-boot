package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.schedule.CreateWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.request.schedule.UpdateWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.response.schedule.WorkScheduleResponse;

import java.util.List;

public interface WorkScheduleService {

    WorkScheduleResponse create(
            CreateWorkScheduleRequest request
    );

    List<WorkScheduleResponse> getAll();

    WorkScheduleResponse getById(
            Long id
    );

    WorkScheduleResponse update(
            Long id,
            UpdateWorkScheduleRequest request
    );

    void delete(Long id);
}
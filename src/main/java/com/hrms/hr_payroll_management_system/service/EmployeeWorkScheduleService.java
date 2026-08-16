package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.schedule.AssignWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.response.schedule.EmployeeWorkScheduleResponse;

import java.util.List;

public interface EmployeeWorkScheduleService {

    EmployeeWorkScheduleResponse assign(
            Long employeeId,
            AssignWorkScheduleRequest request
    );

    List<EmployeeWorkScheduleResponse> getByEmployeeId(
            Long employeeId
    );

    void delete(Long id);
}
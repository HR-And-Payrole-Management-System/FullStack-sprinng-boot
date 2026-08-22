package com.hrms.hr_payroll_management_system.service.performance;

import com.hrms.hr_payroll_management_system.dto.request.performance.CreatePerformanceGoalRequest;
import com.hrms.hr_payroll_management_system.dto.request.performance.UpdateGoalProgressRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceGoalResponse;

import java.util.List;

public interface PerformanceGoalService {

    PerformanceGoalResponse create(
            Long employeeId,
            CreatePerformanceGoalRequest request
    );

    PerformanceGoalResponse updateProgress(
            Long id,
            UpdateGoalProgressRequest request
    );

    List<PerformanceGoalResponse> getEmployeeGoals(
            Long employeeId,
            Long cycleId
    );

    void delete(Long id);
}
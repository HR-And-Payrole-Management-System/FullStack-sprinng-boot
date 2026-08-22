package com.hrms.hr_payroll_management_system.service.performance;

import com.hrms.hr_payroll_management_system.dto.request.performance.CreatePerformanceCycleRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceCycleResponse;

import java.util.List;

public interface PerformanceCycleService {

    PerformanceCycleResponse create(
            CreatePerformanceCycleRequest request
    );

    List<PerformanceCycleResponse> getAll();

    PerformanceCycleResponse getById(Long id);

    PerformanceCycleResponse activate(Long id);

    PerformanceCycleResponse close(Long id);

    void delete(Long id);
}
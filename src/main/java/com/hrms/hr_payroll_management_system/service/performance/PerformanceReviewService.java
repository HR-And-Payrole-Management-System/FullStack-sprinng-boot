package com.hrms.hr_payroll_management_system.service.performance;

import com.hrms.hr_payroll_management_system.dto.request.performance.ManagerReviewRequest;
import com.hrms.hr_payroll_management_system.dto.request.performance.SelfReviewRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceReviewResponse;

import java.util.List;

public interface PerformanceReviewService {

    PerformanceReviewResponse selfReview(
            Long employeeId,
            Long cycleId,
            SelfReviewRequest request
    );

    PerformanceReviewResponse managerReview(
            Long employeeId,
            Long cycleId,
            ManagerReviewRequest request
    );

    PerformanceReviewResponse complete(
            Long employeeId,
            Long cycleId
    );

    PerformanceReviewResponse get(
            Long employeeId,
            Long cycleId
    );

    List<PerformanceReviewResponse> getHistory(
            Long employeeId
    );
}
package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.leave.CreateLeaveRequest;
import com.hrms.hr_payroll_management_system.dto.request.leave.ReviewLeaveRequest;
import com.hrms.hr_payroll_management_system.dto.response.leave.LeaveRequestResponse;

public interface LeaveService {

    LeaveRequestResponse requestLeave(
            Long employeeId,
            CreateLeaveRequest request
    );

    PageResponse<LeaveRequestResponse> getByEmployeeId(
            Long employeeId,
            int page,
            int size
    );

    LeaveRequestResponse approve(
            Long id,
            ReviewLeaveRequest request
    );

    LeaveRequestResponse reject(
            Long id,
            ReviewLeaveRequest request
    );

    LeaveRequestResponse cancel(Long id);

    int accrueYearlyBalances(int year);
}
package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.leave.CreateLeaveTypeRequest;
import com.hrms.hr_payroll_management_system.dto.request.leave.UpdateLeaveTypeRequest;
import com.hrms.hr_payroll_management_system.dto.response.leave.LeaveTypeResponse;

import java.util.List;

public interface LeaveTypeService {

    LeaveTypeResponse create(CreateLeaveTypeRequest request);

    List<LeaveTypeResponse> getAll();

    LeaveTypeResponse getById(Long id);

    LeaveTypeResponse update(
            Long id,
            UpdateLeaveTypeRequest request
    );

    void delete(Long id);
}
package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.location.CreateLocationRequest;
import com.hrms.hr_payroll_management_system.dto.request.location.UpdateLocationRequest;
import com.hrms.hr_payroll_management_system.dto.response.location.LocationResponse;

import java.util.List;

public interface LocationService {

    LocationResponse create(CreateLocationRequest request);

    List<LocationResponse> getAll();

    LocationResponse getById(Long id);

    LocationResponse update(
            Long id,
            UpdateLocationRequest request
    );

    void delete(Long id);

    List<LocationResponse> getByBranchId(Long branchId);
}
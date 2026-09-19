package com.hrms.hr_payroll_management_system.service.okr;

import com.hrms.hr_payroll_management_system.dto.request.okr.CreateOkrCycleRequest;
import com.hrms.hr_payroll_management_system.dto.response.okr.OkrCycleResponse;

import java.util.List;

public interface OkrCycleService {
    OkrCycleResponse create(CreateOkrCycleRequest request);
    List<OkrCycleResponse> getAll();
    OkrCycleResponse close(Long id);
}
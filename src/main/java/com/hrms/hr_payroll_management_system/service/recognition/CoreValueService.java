package com.hrms.hr_payroll_management_system.service.recognition;

import com.hrms.hr_payroll_management_system.dto.request.recognition.CreateCoreValueRequest;
import com.hrms.hr_payroll_management_system.dto.response.recognition.CoreValueResponse;

import java.util.List;

public interface CoreValueService {
    CoreValueResponse create(CreateCoreValueRequest request);
    List<CoreValueResponse> getAll();
    void delete(Long id);
}
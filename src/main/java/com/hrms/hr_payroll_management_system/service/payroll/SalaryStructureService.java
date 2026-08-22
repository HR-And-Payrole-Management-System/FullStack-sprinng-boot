package com.hrms.hr_payroll_management_system.service.payroll;

import com.hrms.hr_payroll_management_system.dto.request.payroll.CreateSalaryStructureRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.SalaryStructureResponse;

import java.util.List;

public interface SalaryStructureService {

    SalaryStructureResponse create(CreateSalaryStructureRequest request);

    List<SalaryStructureResponse> getAll();

    SalaryStructureResponse getById(Long id);

    void delete(Long id);
}
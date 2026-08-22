package com.hrms.hr_payroll_management_system.service.payroll;

import com.hrms.hr_payroll_management_system.dto.request.payroll.AssignEmployeeSalaryRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.EmployeeSalaryResponse;

import java.util.List;

public interface EmployeeSalaryService {

    EmployeeSalaryResponse assign(
            Long employeeId,
            AssignEmployeeSalaryRequest request
    );

    List<EmployeeSalaryResponse> getByEmployeeId(
            Long employeeId
    );

    void delete(Long id);
}
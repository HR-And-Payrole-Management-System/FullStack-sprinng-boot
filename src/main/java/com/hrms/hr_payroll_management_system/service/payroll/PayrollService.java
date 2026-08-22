package com.hrms.hr_payroll_management_system.service.payroll;

import com.hrms.hr_payroll_management_system.dto.request.payroll.GeneratePayrollRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.PayrollResponse;

import java.util.List;

public interface PayrollService {

    PayrollResponse generate(GeneratePayrollRequest request);

    PayrollResponse getById(Long id);

    List<PayrollResponse> getAll();

    PayrollResponse approve(Long id);

    PayrollResponse markPaid(Long id);
}
package com.hrms.hr_payroll_management_system.service.payroll;

import com.hrms.hr_payroll_management_system.dto.response.payroll.PayslipResponse;

public interface PayslipService {

    PayslipResponse getPayslip(Long payrollId);
}
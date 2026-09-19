package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.expense.RejectExpenseRequest;
import com.hrms.hr_payroll_management_system.dto.request.expense.SubmitExpenseRequest;
import com.hrms.hr_payroll_management_system.dto.response.expense.ExpenseClaimResponse;

import java.util.List;

public interface ExpenseService {
    ExpenseClaimResponse submit(SubmitExpenseRequest request);
    ExpenseClaimResponse approve(Long claimId, Long approvedByEmployeeId);
    ExpenseClaimResponse reject(Long claimId, RejectExpenseRequest request);
    List<ExpenseClaimResponse> getPending();
    List<ExpenseClaimResponse> getByEmployee(Long employeeId);
}
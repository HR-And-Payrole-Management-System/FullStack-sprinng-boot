package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.expense.RejectExpenseRequest;
import com.hrms.hr_payroll_management_system.dto.request.expense.SubmitExpenseRequest;
import com.hrms.hr_payroll_management_system.dto.response.expense.ExpenseClaimResponse;
import com.hrms.hr_payroll_management_system.service.ExpenseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<ExpenseClaimResponse>> submit(@Valid @RequestBody SubmitExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ExpenseClaimResponse>builder()
                .success(true).message("Expense submitted.").data(expenseService.submit(request)).build());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<ExpenseClaimResponse>> approve(
            @PathVariable Long id, @RequestParam(required = false) Long approvedByEmployeeId
    ) {
        return ResponseEntity.ok(ApiResponse.<ExpenseClaimResponse>builder()
                .success(true).message("Expense approved and sent to payroll.").data(expenseService.approve(id, approvedByEmployeeId)).build());
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<ExpenseClaimResponse>> reject(
            @PathVariable Long id, @Valid @RequestBody RejectExpenseRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.<ExpenseClaimResponse>builder()
                .success(true).message("Expense rejected.").data(expenseService.reject(id, request)).build());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<List<ExpenseClaimResponse>>> getPending() {
        return ResponseEntity.ok(ApiResponse.<List<ExpenseClaimResponse>>builder()
                .success(true).message("Pending expenses retrieved.").data(expenseService.getPending()).build());
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<ExpenseClaimResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.<List<ExpenseClaimResponse>>builder()
                .success(true).message("Employee expenses retrieved.").data(expenseService.getByEmployee(employeeId)).build());
    }
}
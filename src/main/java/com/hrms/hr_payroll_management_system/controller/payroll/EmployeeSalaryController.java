package com.hrms.hr_payroll_management_system.controller.payroll;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.payroll.AssignEmployeeSalaryRequest;
import com.hrms.hr_payroll_management_system.dto.response.payroll.EmployeeSalaryResponse;
import com.hrms.hr_payroll_management_system.service.payroll.EmployeeSalaryService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employee-salaries")
@RequiredArgsConstructor
public class EmployeeSalaryController {

    private final EmployeeSalaryService employeeSalaryService;

    @PostMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_UPDATE')"
    )
    public ResponseEntity<ApiResponse<EmployeeSalaryResponse>> assign(
            @PathVariable Long employeeId,
            @Valid @RequestBody AssignEmployeeSalaryRequest request
    ) {

        EmployeeSalaryResponse salary =
                employeeSalaryService.assign(
                        employeeId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse
                                .<EmployeeSalaryResponse>builder()
                                .success(true)
                                .message(
                                        "Employee salary assigned successfully."
                                )
                                .data(salary)
                                .build()
                );
    }

    @GetMapping("/employees/{employeeId}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<EmployeeSalaryResponse>>
            > getByEmployee(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<EmployeeSalaryResponse>>builder()
                        .success(true)
                        .message(
                                "Employee salary history retrieved successfully."
                        )
                        .data(
                                employeeSalaryService
                                        .getByEmployeeId(
                                                employeeId
                                        )
                        )
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('PAYROLL_UPDATE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        employeeSalaryService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.employee.AssignEmployeeOrganizationRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.CreateEmployeeRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.UpdateEmployeeRequest;
import com.hrms.hr_payroll_management_system.dto.response.employee.EmployeeResponse;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.EmploymentType;
import com.hrms.hr_payroll_management_system.service.EmployeeService;
import com.hrms.hr_payroll_management_system.dto.request.employee.ChangeEmployeeStatusRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import com.hrms.hr_payroll_management_system.dto.request.employee.UpsertEmergencyContactRequest;
import com.hrms.hr_payroll_management_system.dto.response.employee.EmergencyContactResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('EMPLOYEE_CREATE')"
    )
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(
            @Valid @RequestBody CreateEmployeeRequest request
    ) {

        EmployeeResponse employee =
                employeeService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<EmployeeResponse>builder()
                                .success(true)
                                .message(
                                        "Employee created successfully."
                                )
                                .data(employee)
                                .build()
                );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')"
    )
    public ResponseEntity<ApiResponse<EmployeeResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<EmployeeResponse>builder()
                        .success(true)
                        .message(
                                "Employee retrieved successfully."
                        )
                        .data(
                                employeeService.getById(id)
                        )
                        .build()
        );
    }

        @GetMapping
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')"
        )
        public ResponseEntity<
                ApiResponse<PageResponse<EmployeeResponse>>
                > getAll(

                @RequestParam(defaultValue = "0")
                int page,

                @RequestParam(defaultValue = "10")
                int size,

                @RequestParam(required = false)
                String keyword,

                @RequestParam(required = false)
                Long departmentId,

                @RequestParam(required = false)
                Long positionId,

                @RequestParam(required = false)
                EmploymentType employmentType,

                @RequestParam(required = false)
                EmployeeStatus status,

                @RequestParam(defaultValue = "id")
                String sortBy,

                @RequestParam(defaultValue = "asc")
                String direction
        ) {

        PageResponse<EmployeeResponse> employees =
                employeeService.getAll(
                        page,
                        size,
                        keyword,
                        departmentId,
                        positionId,
                        employmentType,
                        status,
                        sortBy,
                        direction
                );

        return ResponseEntity.ok(
                ApiResponse
                        .<PageResponse<EmployeeResponse>>builder()
                        .success(true)
                        .message(
                                "Employees retrieved successfully."
                        )
                        .data(employees)
                        .build()
        );
        }

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('EMPLOYEE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<EmployeeResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<EmployeeResponse>builder()
                        .success(true)
                        .message(
                                "Employee updated successfully."
                        )
                        .data(
                                employeeService.update(
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @PutMapping("/{employeeId}/organization")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('EMPLOYEE_UPDATE')"
    )
    public ResponseEntity<ApiResponse<EmployeeResponse>> assignOrganization(
            @PathVariable Long employeeId,
            @Valid @RequestBody AssignEmployeeOrganizationRequest request
    ) {

        EmployeeResponse employee =
                employeeService.assignOrganization(
                        employeeId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<EmployeeResponse>builder()
                        .success(true)
                        .message(
                                "Employee organization assigned successfully."
                        )
                        .data(employee)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('EMPLOYEE_DELETE')"
    )
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        employeeService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
    @PutMapping("/{employeeId}/emergency-contact")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('EMPLOYEE_UPDATE')"
        )
        public ResponseEntity<ApiResponse<EmergencyContactResponse>> saveEmergencyContact(
                @PathVariable Long employeeId,
                @Valid @RequestBody UpsertEmergencyContactRequest request
        ) {

        EmergencyContactResponse contact =
                employeeService.saveEmergencyContact(
                        employeeId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<EmergencyContactResponse>builder()
                        .success(true)
                        .message(
                                "Emergency contact saved successfully."
                        )
                        .data(contact)
                        .build()
        );
        }
        @GetMapping("/{employeeId}/emergency-contact")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')"
        )
        public ResponseEntity<ApiResponse<EmergencyContactResponse>> getEmergencyContact(
                @PathVariable Long employeeId
        ) {

        EmergencyContactResponse contact =
                employeeService.getEmergencyContact(employeeId);

        return ResponseEntity.ok(
                ApiResponse.<EmergencyContactResponse>builder()
                        .success(true)
                        .message(
                                "Emergency contact retrieved successfully."
                        )
                        .data(contact)
                        .build()
        );
        }
        @DeleteMapping("/{employeeId}/emergency-contact")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('EMPLOYEE_UPDATE')"
        )
        public ResponseEntity<Void> deleteEmergencyContact(
                @PathVariable Long employeeId
        ) {

        employeeService.deleteEmergencyContact(employeeId);

        return ResponseEntity.noContent().build();
        }
        @PutMapping("/{employeeId}/status")
        @PreAuthorize(
                "hasRole('ADMIN') or hasAuthority('EMPLOYEE_UPDATE')"
        )
        public ResponseEntity<ApiResponse<EmployeeResponse>> changeStatus(
                @PathVariable Long employeeId,
                @Valid @RequestBody ChangeEmployeeStatusRequest request
        ) {

        EmployeeResponse employee =
                employeeService.changeStatus(
                        employeeId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<EmployeeResponse>builder()
                        .success(true)
                        .message(
                                "Employee status changed successfully."
                        )
                        .data(employee)
                        .build()
        );
        }
} 
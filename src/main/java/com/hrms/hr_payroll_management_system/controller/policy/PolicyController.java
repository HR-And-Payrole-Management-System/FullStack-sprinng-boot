package com.hrms.hr_payroll_management_system.controller.policy;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.policy.CreatePolicyRequest;
import com.hrms.hr_payroll_management_system.dto.request.policy.PublishPolicyVersionRequest;
import com.hrms.hr_payroll_management_system.dto.response.policy.PolicyResponse;
import com.hrms.hr_payroll_management_system.service.policy.PolicyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<PolicyResponse>> create(@Valid @RequestBody CreatePolicyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<PolicyResponse>builder()
                .success(true).message("Policy created.").data(policyService.create(request)).build());
    }

    @PostMapping("/{id}/versions")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<PolicyResponse>> publishVersion(
            @PathVariable Long id, @Valid @RequestBody PublishPolicyVersionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<PolicyResponse>builder()
                .success(true).message("New policy version published.").data(policyService.publishNewVersion(id, request)).build());
    }

    @PostMapping("/{id}/acknowledge")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<PolicyResponse>> acknowledge(
            @PathVariable Long id, @RequestParam Long employeeId
    ) {
        return ResponseEntity.ok(ApiResponse.<PolicyResponse>builder()
                .success(true).message("Policy acknowledged.").data(policyService.acknowledge(id, employeeId)).build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<PolicyResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<PolicyResponse>>builder()
                .success(true).message("Policies retrieved.").data(policyService.getAll()).build());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<PolicyResponse>>> getPending(@RequestParam Long employeeId) {
        return ResponseEntity.ok(ApiResponse.<List<PolicyResponse>>builder()
                .success(true).message("Pending policies retrieved.").data(policyService.getPendingForEmployee(employeeId)).build());
    }
    @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
        public ResponseEntity<ApiResponse<PolicyResponse>> update(
                @PathVariable Long id, @Valid @RequestBody CreatePolicyRequest request
        ) {
        return ResponseEntity.ok(ApiResponse.<PolicyResponse>builder()
                .success(true).message("Policy updated.").data(policyService.update(id, request)).build());
        }


        @PutMapping("/{id}/archive")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Void>> archive(@PathVariable Long id) {
        policyService.archive(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Policy archived.").build());
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        policyService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Policy deleted.").build());
        }
}
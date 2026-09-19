package com.hrms.hr_payroll_management_system.service.policy.impl;

import com.hrms.hr_payroll_management_system.dto.request.policy.CreatePolicyRequest;
import com.hrms.hr_payroll_management_system.dto.request.policy.PublishPolicyVersionRequest;
import com.hrms.hr_payroll_management_system.dto.response.policy.PolicyAcknowledgmentStatusResponse;
import com.hrms.hr_payroll_management_system.dto.response.policy.PolicyResponse;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.policy.Policy;
import com.hrms.hr_payroll_management_system.entity.policy.PolicyAcknowledgment;
import com.hrms.hr_payroll_management_system.entity.policy.PolicyVersion;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.PolicyStatus;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.policy.PolicyAcknowledgmentRepository;
import com.hrms.hr_payroll_management_system.repository.policy.PolicyRepository;
import com.hrms.hr_payroll_management_system.repository.policy.PolicyVersionRepository;
import com.hrms.hr_payroll_management_system.service.audit.AuditLogService;
import com.hrms.hr_payroll_management_system.service.policy.PolicyService;
import com.hrms.hr_payroll_management_system.enums.AuditAction;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final PolicyVersionRepository policyVersionRepository;
    private final PolicyAcknowledgmentRepository acknowledgmentRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public PolicyResponse create(CreatePolicyRequest request) {
        Policy policy = Policy.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .requiresAcknowledgment(request.isRequiresAcknowledgment())
                .status(PolicyStatus.DRAFT)
                .build();

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            policy.setDepartment(dept);
        }

        Policy saved = policyRepository.save(policy);
        auditLogService.log(AuditAction.CREATE, "Policy", saved.getId(), "Created policy: " + saved.getTitle());
        return toResponse(saved);
    }
    @Override
        @Transactional
        public PolicyResponse update(Long id, CreatePolicyRequest request) {
        Policy policy = findPolicy(id);
        policy.setTitle(request.getTitle());
        policy.setCategory(request.getCategory());
        policy.setRequiresAcknowledgment(request.isRequiresAcknowledgment());
        policy.setDepartment(request.getDepartmentId() != null
                ? departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Department not found"))
                : null);

        Policy saved = policyRepository.save(policy);
        auditLogService.log(AuditAction.UPDATE, "Policy", saved.getId(), "Updated policy: " + saved.getTitle());
        return toResponse(saved);
        }

        @Override
        @Transactional
        public void archive(Long id) {
        Policy policy = findPolicy(id);
        policy.setStatus(PolicyStatus.ARCHIVED);
        policyRepository.save(policy);
        auditLogService.log(AuditAction.UPDATE, "Policy", id, "Archived policy: " + policy.getTitle());
        }

        @Override
        @Transactional
        public void delete(Long id) {
        Policy policy = findPolicy(id);
        policyRepository.delete(policy);
        auditLogService.log(AuditAction.DELETE, "Policy", id, "Deleted policy: " + policy.getTitle());
        }

    @Override
    @Transactional
    public PolicyResponse publishNewVersion(Long policyId, PublishPolicyVersionRequest request) {
        Policy policy = findPolicy(policyId);

        int nextVersion = policy.getVersions().stream()
                .mapToInt(PolicyVersion::getVersionNumber)
                .max()
                .orElse(0) + 1;

        PolicyVersion version = PolicyVersion.builder()
                .policy(policy)
                .versionNumber(nextVersion)
                .content(request.getContent())
                .publishedAt(LocalDateTime.now())
                .build();

        if (request.getPublishedByEmployeeId() != null) {
            employeeRepository.findById(request.getPublishedByEmployeeId()).ifPresent(version::setPublishedBy);
        }

        policy.getVersions().add(version);
        policy.setStatus(PolicyStatus.PUBLISHED);
        // NOTE: no acknowledgments are copied forward here — that's the
        // whole point. Every published version starts at 0% acknowledged,
        // even if everyone had signed off on version (nextVersion - 1).
        policyRepository.save(policy);

        auditLogService.log(AuditAction.UPDATE, "Policy", policy.getId(),
                "Published version " + nextVersion + " of policy: " + policy.getTitle());

        return toResponse(policy);
    }

    @Override
    @Transactional
    public PolicyResponse acknowledge(Long policyId, Long employeeId) {
        Policy policy = findPolicy(policyId);
        PolicyVersion currentVersion = latestVersion(policy)
                .orElseThrow(() -> new IllegalStateException("Policy has no published version to acknowledge."));

        // Idempotent: acknowledging twice doesn't create duplicate rows or
        // error out — it just confirms the existing acknowledgment.
        acknowledgmentRepository.findByPolicyVersionIdAndEmployeeId(currentVersion.getId(), employeeId)
                .orElseGet(() -> {
                    Employee employee = employeeRepository.findById(employeeId)
                            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
                    PolicyAcknowledgment ack = PolicyAcknowledgment.builder()
                            .policyVersion(currentVersion)
                            .employee(employee)
                            .acknowledgedAt(LocalDateTime.now())
                            .build();
                    return acknowledgmentRepository.save(ack);
                });

        return toResponse(policy);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicyResponse> getAll() {
        return policyRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicyResponse> getPendingForEmployee(Long employeeId) {
        return getAll().stream()
                .filter(p -> p.isRequiresAcknowledgment() && p.getCurrentVersionId() != null)
                .filter(p -> p.getAcknowledgments().stream()
                        .filter(a -> a.getEmployeeId().equals(employeeId))
                        .noneMatch(PolicyAcknowledgmentStatusResponse::isAcknowledged))
                .collect(Collectors.toList());
    }

    private Policy findPolicy(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + id));
    }

    private java.util.Optional<PolicyVersion> latestVersion(Policy policy) {
        return policy.getVersions().stream()
                .max(Comparator.comparingInt(PolicyVersion::getVersionNumber));
    }

    private List<Employee> scopedEmployees(Policy policy) {
        List<Employee> all = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
        if (policy.getDepartment() == null) return all;

        Long deptId = policy.getDepartment().getId();
        return all.stream()
                .filter(e -> e.getDepartment() != null && e.getDepartment().getId().equals(deptId))
                .collect(Collectors.toList());
    }

    private PolicyResponse toResponse(Policy policy) {
        var latest = latestVersion(policy).orElse(null);
        List<Employee> scoped = scopedEmployees(policy);

        List<PolicyAcknowledgmentStatusResponse> ackStatuses;
        int acknowledgedCount = 0;

        if (latest != null) {
            List<PolicyAcknowledgment> acks = acknowledgmentRepository.findByPolicyVersionId(latest.getId());
            var ackedEmployeeIds = acks.stream().map(a -> a.getEmployee().getId()).collect(Collectors.toSet());

            ackStatuses = scoped.stream()
                    .map(e -> PolicyAcknowledgmentStatusResponse.builder()
                            .employeeId(e.getId())
                            .employeeName(e.getFirstName() + " " + e.getLastName())
                            .acknowledged(ackedEmployeeIds.contains(e.getId()))
                            .build())
                    .sorted(Comparator.comparing(PolicyAcknowledgmentStatusResponse::isAcknowledged))
                    .collect(Collectors.toList());

            acknowledgedCount = (int) ackStatuses.stream().filter(PolicyAcknowledgmentStatusResponse::isAcknowledged).count();
        } else {
            ackStatuses = List.of();
        }

        int total = scoped.size();
        int percent = total == 0 ? 100 : (int) Math.round((acknowledgedCount * 100.0) / total);

        return PolicyResponse.builder()
                .id(policy.getId())
                .title(policy.getTitle())
                .category(policy.getCategory())
                .scopeLabel(policy.getDepartment() != null ? policy.getDepartment().getName() : "Company-wide")
                .requiresAcknowledgment(policy.isRequiresAcknowledgment())
                .status(policy.getStatus().name())
                .currentVersionNumber(latest != null ? latest.getVersionNumber() : null)
                .currentVersionId(latest != null ? latest.getId() : null)
                .currentContent(latest != null ? latest.getContent() : null)
                .currentPublishedAt(latest != null ? latest.getPublishedAt() : null)
                .acknowledgedCount(acknowledgedCount)
                .totalInScope(total)
                .acknowledgmentPercent(percent)
                .acknowledgments(ackStatuses)
                .build();
    }
}
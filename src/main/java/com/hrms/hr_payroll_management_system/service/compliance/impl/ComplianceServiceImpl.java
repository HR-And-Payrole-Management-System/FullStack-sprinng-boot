package com.hrms.hr_payroll_management_system.service.compliance.impl;

import com.hrms.hr_payroll_management_system.dto.request.compliance.CreateComplianceRequirementRequest;
import com.hrms.hr_payroll_management_system.dto.response.compliance.ComplianceRequirementResponse;
import com.hrms.hr_payroll_management_system.dto.response.compliance.EmployeeComplianceResponse;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.compliance.ComplianceRequirement;
import com.hrms.hr_payroll_management_system.entity.document.DocumentType;
import com.hrms.hr_payroll_management_system.entity.document.EmployeeDocument;
import com.hrms.hr_payroll_management_system.entity.training.TrainingEnrollment;
import com.hrms.hr_payroll_management_system.entity.training.TrainingProgram;
import com.hrms.hr_payroll_management_system.enums.*;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.compliance.ComplianceRequirementRepository;
import com.hrms.hr_payroll_management_system.repository.document.DocumentTypeRepository;
import com.hrms.hr_payroll_management_system.repository.document.EmployeeDocumentRepository;
import com.hrms.hr_payroll_management_system.repository.training.TrainingEnrollmentRepository;
import com.hrms.hr_payroll_management_system.repository.training.TrainingProgramRepository;
import com.hrms.hr_payroll_management_system.service.compliance.ComplianceService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplianceServiceImpl implements ComplianceService {

    private final ComplianceRequirementRepository requirementRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final EmployeeDocumentRepository employeeDocumentRepository;
    private final TrainingEnrollmentRepository trainingEnrollmentRepository;
    private final com.hrms.hr_payroll_management_system.service.audit.AuditLogService auditLogService;

    @Override
    @Transactional
    public ComplianceRequirementResponse create(CreateComplianceRequirementRequest request) {
        ComplianceRequirement requirement = ComplianceRequirement.builder()
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .build();

        if (request.getType() == ComplianceRequirementType.DOCUMENT) {
            DocumentType docType = documentTypeRepository.findById(request.getDocumentTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document type not found"));
            requirement.setDocumentType(docType);
        } else {
            TrainingProgram program = trainingProgramRepository.findById(request.getTrainingProgramId())
                    .orElseThrow(() -> new ResourceNotFoundException("Training program not found"));
            requirement.setTrainingProgram(program);
        }

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            requirement.setDepartment(dept);
        }

        return toResponse(requirementRepository.save(requirement));
    }
    @Override
    @Transactional
    public ComplianceRequirementResponse update(Long id, CreateComplianceRequirementRequest request) {
        ComplianceRequirement requirement = requirementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance requirement not found: " + id));

        requirement.setName(request.getName());
        requirement.setDescription(request.getDescription());
        requirement.setType(request.getType());
        requirement.setDocumentType(null);
        requirement.setTrainingProgram(null);

        if (request.getType() == ComplianceRequirementType.DOCUMENT) {
            requirement.setDocumentType(documentTypeRepository.findById(request.getDocumentTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document type not found")));
        } else {
            requirement.setTrainingProgram(trainingProgramRepository.findById(request.getTrainingProgramId())
                    .orElseThrow(() -> new ResourceNotFoundException("Training program not found")));
        }

        requirement.setDepartment(request.getDepartmentId() != null
                ? departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Department not found"))
                : null);

        ComplianceRequirement saved = requirementRepository.save(requirement);
        auditLogService.log(AuditAction.UPDATE, "ComplianceRequirement", saved.getId(),
                "Updated compliance requirement: " + saved.getName());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ComplianceRequirement requirement = requirementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance requirement not found: " + id));
        requirementRepository.delete(requirement);
        auditLogService.log(AuditAction.DELETE, "ComplianceRequirement", id,
                "Deleted compliance requirement: " + requirement.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplianceRequirementResponse> getAll() {
        return requirementRepository.findByStatus(Status.ACTIVE).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplianceRequirementResponse> getNonCompliantOnly() {
        return getAll().stream()
                .filter(r -> r.getNonCompliantCount() > 0)
                .collect(Collectors.toList());
    }

    /** Every employee this requirement applies to: everyone if company-wide,
     *  or just the scoped department. */
    private List<Employee> scopedEmployees(ComplianceRequirement requirement) {
        List<Employee> all = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
        if (requirement.getDepartment() == null) return all;

        Long deptId = requirement.getDepartment().getId();
        return all.stream()
                .filter(e -> e.getDepartment() != null && e.getDepartment().getId().equals(deptId))
                .collect(Collectors.toList());
    }

    /** DOCUMENT requirement: find that employee's most recent VERIFIED
     *  document of the required type, and derive status from its expiry
     *  date — nothing here is stored, it's all computed against the
     *  existing document table. */
    private EmployeeComplianceResponse evaluateDocument(Employee employee, ComplianceRequirement requirement) {
        List<EmployeeDocument> docs = employeeDocumentRepository.findByEmployeeIdOrderByIdDesc(employee.getId());

        EmployeeDocument match = docs.stream()
                .filter(d -> d.getDocumentType().getId().equals(requirement.getDocumentType().getId()))
                .filter(d -> d.getStatus() == DocumentStatus.VERIFIED)
                .findFirst()
                .orElse(null);

        if (match == null) {
            return build(employee, ComplianceStatus.NON_COMPLIANT, null, "No verified document on file");
        }

        if (match.getExpiryDate() == null) {
            return build(employee, ComplianceStatus.COMPLIANT, null, "Valid (no expiry)");
        }

        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), match.getExpiryDate());
        if (daysLeft < 0) {
            return build(employee, ComplianceStatus.NON_COMPLIANT, match.getExpiryDate(), "Expired");
        }
        if (daysLeft <= 30) {
            return build(employee, ComplianceStatus.AT_RISK, match.getExpiryDate(), "Expires in " + daysLeft + " days");
        }
        return build(employee, ComplianceStatus.COMPLIANT, match.getExpiryDate(), "Valid");
    }

    /** TRAINING requirement: has this employee COMPLETED an enrollment in
     *  the required program? Same idea — read from existing enrollment
     *  data, never duplicated. */
    private EmployeeComplianceResponse evaluateTraining(Employee employee, ComplianceRequirement requirement) {
        List<TrainingEnrollment> enrollments = trainingEnrollmentRepository.findByEmployeeId(employee.getId());

        boolean completed = enrollments.stream()
                .anyMatch(en -> en.getTrainingProgram().getId().equals(requirement.getTrainingProgram().getId())
                        && en.getStatus() == TrainingEnrollmentStatus.COMPLETED);

        return completed
                ? build(employee, ComplianceStatus.COMPLIANT, null, "Training completed")
                : build(employee, ComplianceStatus.NON_COMPLIANT, null, "Training not completed");
    }

    private EmployeeComplianceResponse build(Employee e, ComplianceStatus status, LocalDate expiry, String detail) {
        return EmployeeComplianceResponse.builder()
                .employeeId(e.getId())
                .employeeName(e.getFirstName() + " " + e.getLastName())
                .status(status.name())
                .expiryDate(expiry)
                .detail(detail)
                .build();
    }

    private ComplianceRequirementResponse toResponse(ComplianceRequirement requirement) {
        List<EmployeeComplianceResponse> results = scopedEmployees(requirement).stream()
                .map(e -> requirement.getType() == ComplianceRequirementType.DOCUMENT
                        ? evaluateDocument(e, requirement)
                        : evaluateTraining(e, requirement))
                .sorted(Comparator.comparing(EmployeeComplianceResponse::getStatus)) // groups NON_COMPLIANT/AT_RISK together
                .collect(Collectors.toList());

        int compliant = (int) results.stream().filter(r -> "COMPLIANT".equals(r.getStatus())).count();
        int atRisk = (int) results.stream().filter(r -> "AT_RISK".equals(r.getStatus())).count();
        int nonCompliant = (int) results.stream().filter(r -> "NON_COMPLIANT".equals(r.getStatus())).count();
        int total = results.size();
        int percent = total == 0 ? 100 : (int) Math.round((compliant * 100.0) / total);

        return ComplianceRequirementResponse.builder()
            .id(requirement.getId())
            .name(requirement.getName())
            .type(requirement.getType().name())
            .scopeLabel(requirement.getDepartment() != null ? requirement.getDepartment().getName() : "Company-wide")
            .documentTypeId(requirement.getDocumentType() != null ? requirement.getDocumentType().getId() : null)
            .trainingProgramId(requirement.getTrainingProgram() != null ? requirement.getTrainingProgram().getId() : null)
            .departmentId(requirement.getDepartment() != null ? requirement.getDepartment().getId() : null)
            .compliantCount(compliant)
            .atRiskCount(atRisk)
            .nonCompliantCount(nonCompliant)
            .compliancePercent(percent)
            .employees(results)
            .build();
    }
}
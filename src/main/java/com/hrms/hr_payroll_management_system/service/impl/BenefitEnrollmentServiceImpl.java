package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.benefit.EnrollBenefitRequest;
import com.hrms.hr_payroll_management_system.dto.response.benefit.BenefitEnrollmentResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.payroll.BenefitEnrollment;
import com.hrms.hr_payroll_management_system.entity.payroll.BenefitRule;
import com.hrms.hr_payroll_management_system.enums.BenefitEnrollmentStatus;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.BenefitEnrollmentRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.BenefitRuleRepository;
import com.hrms.hr_payroll_management_system.service.BenefitEnrollmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BenefitEnrollmentServiceImpl implements BenefitEnrollmentService {

    private final BenefitEnrollmentRepository enrollmentRepository;
    private final EmployeeRepository employeeRepository;
    private final BenefitRuleRepository benefitRuleRepository;

    @Override
    @Transactional
    public BenefitEnrollmentResponse enroll(EnrollBenefitRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        BenefitRule rule = benefitRuleRepository.findById(request.getBenefitRuleId())
                .orElseThrow(() -> new ResourceNotFoundException("Benefit rule not found"));

        // Re-enrolling after a waiver reuses the same row (unique constraint
        // on employee+rule) instead of creating duplicate history rows.
        BenefitEnrollment enrollment = enrollmentRepository
                .findByEmployeeIdAndBenefitRuleId(request.getEmployeeId(), request.getBenefitRuleId())
                .orElseGet(() -> BenefitEnrollment.builder().employee(employee).benefitRule(rule).build());

        enrollment.setStatus(BenefitEnrollmentStatus.ENROLLED);
        enrollment.setEffectiveDate(request.getEffectiveDate());
        enrollment.setEndDate(null);

        return toResponse(enrollmentRepository.save(enrollment));
    }

    @Override
    @Transactional
    public BenefitEnrollmentResponse waive(Long enrollmentId) {
        BenefitEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        enrollment.setStatus(BenefitEnrollmentStatus.WAIVED);
        enrollment.setEndDate(java.time.LocalDate.now());
        return toResponse(enrollmentRepository.save(enrollment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BenefitEnrollmentResponse> getByEmployee(Long employeeId) {
        return enrollmentRepository.findByEmployeeId(employeeId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private BenefitEnrollmentResponse toResponse(BenefitEnrollment e) {
        return BenefitEnrollmentResponse.builder()
                .id(e.getId())
                .employeeId(e.getEmployee().getId())
                .employeeName(e.getEmployee().getFirstName() + " " + e.getEmployee().getLastName())
                .benefitRuleId(e.getBenefitRule().getId())
                .benefitRuleName(e.getBenefitRule().getName())
                .benefitType(e.getBenefitRule().getType().name())
                .status(e.getStatus().name())
                .effectiveDate(e.getEffectiveDate())
                .endDate(e.getEndDate())
                .build();
    }
}
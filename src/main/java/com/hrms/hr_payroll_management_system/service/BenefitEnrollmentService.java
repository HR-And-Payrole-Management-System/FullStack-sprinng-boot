package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.benefit.EnrollBenefitRequest;
import com.hrms.hr_payroll_management_system.dto.response.benefit.BenefitEnrollmentResponse;

import java.util.List;

public interface BenefitEnrollmentService {
    BenefitEnrollmentResponse enroll(EnrollBenefitRequest request);
    BenefitEnrollmentResponse waive(Long enrollmentId);
    List<BenefitEnrollmentResponse> getByEmployee(Long employeeId);
}
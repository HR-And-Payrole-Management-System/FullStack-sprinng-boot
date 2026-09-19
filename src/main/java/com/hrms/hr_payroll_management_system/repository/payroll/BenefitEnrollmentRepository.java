package com.hrms.hr_payroll_management_system.repository.payroll;

import com.hrms.hr_payroll_management_system.entity.payroll.BenefitEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BenefitEnrollmentRepository extends JpaRepository<BenefitEnrollment, Long> {

    List<BenefitEnrollment> findByEmployeeId(Long employeeId);

    Optional<BenefitEnrollment> findByEmployeeIdAndBenefitRuleId(Long employeeId, Long benefitRuleId);

    // The query the payroll engine actually needs: which rule IDs is this
    // employee actively (ENROLLED, and within date range) subject to, as of
    // a given payroll date.
    @org.springframework.data.jpa.repository.Query("""
        SELECT be.benefitRule.id FROM BenefitEnrollment be
        WHERE be.employee.id = :employeeId
        AND be.status = 'ENROLLED'
        AND be.effectiveDate <= :asOf
        AND (be.endDate IS NULL OR be.endDate >= :asOf)
        """)
    List<Long> findActiveRuleIdsForEmployee(Long employeeId, LocalDate asOf);
}
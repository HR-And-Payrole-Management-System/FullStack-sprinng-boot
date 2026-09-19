package com.hrms.hr_payroll_management_system.repository.survey;

import com.hrms.hr_payroll_management_system.entity.survey.SurveyResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {
    List<SurveyResponse> findBySurveyId(Long surveyId);
    Optional<SurveyResponse> findBySurveyIdAndEmployeeId(Long surveyId, Long employeeId);
}
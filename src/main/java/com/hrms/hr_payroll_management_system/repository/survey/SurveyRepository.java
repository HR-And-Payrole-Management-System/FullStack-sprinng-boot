package com.hrms.hr_payroll_management_system.repository.survey;

import com.hrms.hr_payroll_management_system.entity.survey.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
}
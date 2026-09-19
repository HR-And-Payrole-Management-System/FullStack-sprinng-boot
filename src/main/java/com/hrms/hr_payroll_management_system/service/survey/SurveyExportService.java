package com.hrms.hr_payroll_management_system.service.survey;

public interface SurveyExportService {
    byte[] exportResultsCsv(Long surveyId);
}
package com.hrms.hr_payroll_management_system.service.survey;

import com.hrms.hr_payroll_management_system.dto.request.survey.CreateSurveyRequest;
import com.hrms.hr_payroll_management_system.dto.request.survey.SubmitSurveyResponseRequest;
import com.hrms.hr_payroll_management_system.dto.response.survey.SurveyDetailResponse;
import com.hrms.hr_payroll_management_system.dto.response.survey.SurveyResponseSummary;

import java.util.List;

public interface SurveyService {
    SurveyResponseSummary create(CreateSurveyRequest request);
    SurveyResponseSummary activate(Long surveyId);
    void submitResponse(Long surveyId, SubmitSurveyResponseRequest request);
    List<SurveyResponseSummary> getAll();
    SurveyResponseSummary getResults(Long surveyId);
    List<SurveyResponseSummary> getPendingForEmployee(Long employeeId);
    SurveyDetailResponse getDetail(Long surveyId);
    SurveyResponseSummary update(Long id, CreateSurveyRequest request);
    void delete(Long id);
}
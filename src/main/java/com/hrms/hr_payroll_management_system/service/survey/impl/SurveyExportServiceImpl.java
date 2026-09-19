package com.hrms.hr_payroll_management_system.service.survey.impl;

import com.hrms.hr_payroll_management_system.entity.survey.*;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.survey.SurveyRepository;
import com.hrms.hr_payroll_management_system.repository.survey.SurveyResponseRepository;
import com.hrms.hr_payroll_management_system.service.survey.SurveyExportService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyExportServiceImpl implements SurveyExportService {

    private final SurveyRepository surveyRepository;
    private final SurveyResponseRepository responseRepository;

    @Override
    @Transactional(readOnly = true)
    public byte[] exportResultsCsv(Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResourceNotFoundException("Survey not found: " + surveyId));

        List<SurveyQuestion> questions = survey.getQuestions().stream()
                .sorted(Comparator.comparingInt(SurveyQuestion::getSequenceOrder))
                .toList();

        List<SurveyResponse> responses = responseRepository.findBySurveyId(surveyId);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Header row — if the survey is anonymous, we intentionally omit
            // a "Respondent" column entirely, not just leave it blank, so
            // there's no column even implying identity is available.
            StringBuilder header = new StringBuilder();
            if (!survey.isAnonymous()) header.append("Respondent,");
            header.append("SubmittedAt,");
            questions.forEach(q -> header.append(csvEscape(q.getText())).append(","));
            writer.println(trimTrailingComma(header));

            for (SurveyResponse response : responses) {
                StringBuilder row = new StringBuilder();
                if (!survey.isAnonymous()) {
                    row.append(csvEscape(response.getEmployee().getFirstName() + " " + response.getEmployee().getLastName())).append(",");
                }
                row.append(response.getSubmittedAt()).append(",");

                for (SurveyQuestion q : questions) {
                    String value = response.getAnswers().stream()
                            .filter(a -> a.getQuestion().getId().equals(q.getId()))
                            .findFirst()
                            .map(a -> {
                                if (a.getRatingValue() != null) return a.getRatingValue().toString();
                                if (a.getSelectedOption() != null) return a.getSelectedOption();
                                return a.getTextAnswer() != null ? a.getTextAnswer() : "";
                            })
                            .orElse("");
                    row.append(csvEscape(value)).append(",");
                }
                writer.println(trimTrailingComma(row));
            }
        }
        return out.toByteArray();
    }

    private String csvEscape(String value) {
        if (value == null) return "";
        String escaped = value.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    private String trimTrailingComma(StringBuilder sb) {
        if (sb.length() > 0 && sb.charAt(sb.length() - 1) == ',') sb.setLength(sb.length() - 1);
        return sb.toString();
    }
}
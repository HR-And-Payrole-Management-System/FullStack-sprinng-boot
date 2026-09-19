package com.hrms.hr_payroll_management_system.scheduler;

import com.hrms.hr_payroll_management_system.entity.survey.Survey;
import com.hrms.hr_payroll_management_system.enums.SurveyStatus;
import com.hrms.hr_payroll_management_system.repository.survey.SurveyRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SurveyCloseScheduler {

    private final SurveyRepository surveyRepository;

    @Scheduled(cron = "0 0 1 * * *") // once daily, off-peak
    @Transactional
    public void closeExpiredSurveys() {
        List<Survey> toClose = surveyRepository.findAll().stream()
                .filter(s -> s.getStatus() == SurveyStatus.ACTIVE)
                .filter(s -> s.getClosesAt() != null && s.getClosesAt().isBefore(LocalDate.now()))
                .toList();

        toClose.forEach(s -> s.setStatus(SurveyStatus.CLOSED));
        surveyRepository.saveAll(toClose);

        log.info("Scheduled job: auto-closed {} expired survey(s).", toClose.size());
    }
}
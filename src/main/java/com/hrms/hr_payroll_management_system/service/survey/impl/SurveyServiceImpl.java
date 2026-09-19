package com.hrms.hr_payroll_management_system.service.survey.impl;

import com.hrms.hr_payroll_management_system.dto.request.survey.*;
import com.hrms.hr_payroll_management_system.dto.response.survey.QuestionResultResponse;
import com.hrms.hr_payroll_management_system.dto.response.survey.SurveyDetailResponse;
import com.hrms.hr_payroll_management_system.dto.response.survey.SurveyResponseSummary;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.survey.*;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.SurveyQuestionType;
import com.hrms.hr_payroll_management_system.enums.SurveyStatus;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.survey.SurveyRepository;
import com.hrms.hr_payroll_management_system.repository.survey.SurveyResponseRepository;
import com.hrms.hr_payroll_management_system.service.survey.SurveyService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {

    private final SurveyRepository surveyRepository;
    private final SurveyResponseRepository responseRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public SurveyResponseSummary create(CreateSurveyRequest request) {
        Survey survey = Survey.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .anonymous(request.isAnonymous())
                .closesAt(request.getClosesAt())
                .status(SurveyStatus.DRAFT)
                .build();

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            survey.setDepartment(dept);
        }

        List<SurveyQuestion> questions = request.getQuestions().stream()
                .map(q -> SurveyQuestion.builder()
                        .survey(survey)
                        .text(q.getText())
                        .type(q.getType())
                        .options(q.getOptions())
                        .sequenceOrder(q.getSequenceOrder())
                        .build())
                .collect(Collectors.toList());
        survey.setQuestions(questions);

        return toSummary(surveyRepository.save(survey), false);
    }
    @Override
        @Transactional
        public SurveyResponseSummary update(Long id, CreateSurveyRequest request) {
        Survey survey = findSurvey(id);

        if (survey.getStatus() != SurveyStatus.DRAFT) {
                throw new IllegalStateException("Only DRAFT surveys can be edited — activate a new one instead of changing a live survey's questions.");
        }

        survey.setTitle(request.getTitle());
        survey.setDescription(request.getDescription());
        survey.setAnonymous(request.isAnonymous());
        survey.setClosesAt(request.getClosesAt());
        survey.setDepartment(request.getDepartmentId() != null
                ? departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Department not found"))
                : null);

        survey.getQuestions().clear();
        request.getQuestions().forEach(q -> survey.getQuestions().add(SurveyQuestion.builder()
                .survey(survey).text(q.getText()).type(q.getType()).options(q.getOptions()).sequenceOrder(q.getSequenceOrder())
                .build()));

        return toSummary(surveyRepository.save(survey), false);
        }

        @Override
        @Transactional
        public void delete(Long id) {
        surveyRepository.delete(findSurvey(id));
        }

    @Override
    @Transactional
    public SurveyResponseSummary activate(Long surveyId) {
        Survey survey = findSurvey(surveyId);
        survey.setStatus(SurveyStatus.ACTIVE);
        return toSummary(surveyRepository.save(survey), false);
    }

    @Override
    @Transactional
    public void submitResponse(Long surveyId, SubmitSurveyResponseRequest request) {
        Survey survey = findSurvey(surveyId);

        if (survey.getStatus() != SurveyStatus.ACTIVE) {
            throw new IllegalStateException("This survey is not currently accepting responses.");
        }

        boolean alreadyResponded = responseRepository
                .findBySurveyIdAndEmployeeId(surveyId, request.getEmployeeId()).isPresent();
        if (alreadyResponded) {
            throw new IllegalStateException("You have already responded to this survey.");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Map<Long, SurveyQuestion> questionById = survey.getQuestions().stream()
                .collect(Collectors.toMap(SurveyQuestion::getId, q -> q));

        SurveyResponse response = SurveyResponse.builder()
                .survey(survey)
                .employee(employee)
                .submittedAt(LocalDateTime.now())
                .build();

        List<SurveyAnswer> answers = request.getAnswers().stream()
                .map(a -> {
                    SurveyQuestion question = questionById.get(a.getQuestionId());
                    if (question == null) {
                        throw new IllegalArgumentException("Question does not belong to this survey: " + a.getQuestionId());
                    }
                    return SurveyAnswer.builder()
                            .response(response)
                            .question(question)
                            .ratingValue(a.getRatingValue())
                            .selectedOption(a.getSelectedOption())
                            .textAnswer(a.getTextAnswer())
                            .build();
                })
                .collect(Collectors.toList());

        response.setAnswers(answers);
        responseRepository.save(response);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SurveyResponseSummary> getAll() {
        return surveyRepository.findAll().stream()
                .map(s -> toSummary(s, false))
                .collect(Collectors.toList());
    }
    @Override
        @Transactional(readOnly = true)
        public SurveyDetailResponse getDetail(Long surveyId) {
        Survey survey = findSurvey(surveyId);

        List<SurveyDetailResponse.QuestionDetail> questions = survey.getQuestions().stream()
                .sorted(Comparator.comparingInt(SurveyQuestion::getSequenceOrder))
                .map(q -> SurveyDetailResponse.QuestionDetail.builder()
                        .id(q.getId())
                        .text(q.getText())
                        .type(q.getType().name())
                        .options(q.getOptions() != null
                                ? Arrays.stream(q.getOptions().split(",")).map(String::trim).collect(Collectors.toList())
                                : List.of())
                        .build())
                .collect(Collectors.toList());

        return SurveyDetailResponse.builder()
                .id(survey.getId())
                .title(survey.getTitle())
                .description(survey.getDescription())
                .anonymous(survey.isAnonymous())
                .questions(questions)
                .build();
        }

    @Override
    @Transactional(readOnly = true)
    public SurveyResponseSummary getResults(Long surveyId) {
        return toSummary(findSurvey(surveyId), true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SurveyResponseSummary> getPendingForEmployee(Long employeeId) {
        return surveyRepository.findAll().stream()
                .filter(s -> s.getStatus() == SurveyStatus.ACTIVE)
                .filter(s -> responseRepository.findBySurveyIdAndEmployeeId(s.getId(), employeeId).isEmpty())
                .map(s -> toSummary(s, false))
                .collect(Collectors.toList());
    }

    private Survey findSurvey(Long id) {
        return surveyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Survey not found: " + id));
    }

    private List<Employee> scopedEmployees(Survey survey) {
        List<Employee> all = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
        if (survey.getDepartment() == null) return all;

        Long deptId = survey.getDepartment().getId();
        return all.stream()
                .filter(e -> e.getDepartment() != null && e.getDepartment().getId().equals(deptId))
                .collect(Collectors.toList());
    }

    /** Aggregates every answer to a question WITHOUT ever attaching an
     *  employee's name — this method never even receives a name, only
     *  raw answer values, so an anonymous survey structurally cannot
     *  leak identity through the results endpoint. */
    private QuestionResultResponse aggregateQuestion(SurveyQuestion question, List<SurveyResponse> responses) {
        List<SurveyAnswer> answers = responses.stream()
                .flatMap(r -> r.getAnswers().stream())
                .filter(a -> a.getQuestion().getId().equals(question.getId()))
                .collect(Collectors.toList());

        Double avgRating = null;
        Map<String, Long> optionCounts = null;
        List<String> textAnswers = null;

        if (question.getType() == SurveyQuestionType.RATING_1_5) {
            avgRating = answers.stream()
                    .filter(a -> a.getRatingValue() != null)
                    .mapToInt(SurveyAnswer::getRatingValue)
                    .average()
                    .orElse(0);
            avgRating = Math.round(avgRating * 100.0) / 100.0;
        } else if (question.getType() == SurveyQuestionType.MULTIPLE_CHOICE) {
            optionCounts = answers.stream()
                    .filter(a -> a.getSelectedOption() != null)
                    .collect(Collectors.groupingBy(SurveyAnswer::getSelectedOption, Collectors.counting()));
        } else {
            textAnswers = answers.stream()
                    .map(SurveyAnswer::getTextAnswer)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        return QuestionResultResponse.builder()
                .questionId(question.getId())
                .text(question.getText())
                .type(question.getType().name())
                .averageRating(avgRating)
                .optionCounts(optionCounts)
                .textAnswers(textAnswers)
                .build();
    }

    private SurveyResponseSummary toSummary(Survey survey, boolean includeResults) {
        List<SurveyResponse> responses = responseRepository.findBySurveyId(survey.getId());
        int totalInScope = scopedEmployees(survey).size();
        int responseCount = responses.size();
        int rate = totalInScope == 0 ? 0 : (int) Math.round((responseCount * 100.0) / totalInScope);

        List<QuestionResultResponse> results = includeResults
                ? survey.getQuestions().stream()
                        .sorted(Comparator.comparingInt(SurveyQuestion::getSequenceOrder))
                        .map(q -> aggregateQuestion(q, responses))
                        .collect(Collectors.toList())
                : null;

        return SurveyResponseSummary.builder()
                .id(survey.getId())
                .title(survey.getTitle())
                .description(survey.getDescription())
                .scopeLabel(survey.getDepartment() != null ? survey.getDepartment().getName() : "Company-wide")
                .anonymous(survey.isAnonymous())
                .status(survey.getStatus().name())
                .closesAt(survey.getClosesAt())
                .responseCount(responseCount)
                .totalInScope(totalInScope)
                .responseRatePercent(rate)
                .results(results)
                .build();
    }
}
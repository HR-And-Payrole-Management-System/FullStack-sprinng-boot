package com.hrms.hr_payroll_management_system.service.recruitment.impl;

import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateApplicationRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateApplicationStageRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.ApplicationResponse;
import com.hrms.hr_payroll_management_system.entity.recruitment.Application;
import com.hrms.hr_payroll_management_system.entity.recruitment.Candidate;
import com.hrms.hr_payroll_management_system.entity.recruitment.JobPosting;
import com.hrms.hr_payroll_management_system.enums.ApplicationStage;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.recruitment.ApplicationMapper;
import com.hrms.hr_payroll_management_system.repository.recruitment.ApplicationRepository;
import com.hrms.hr_payroll_management_system.repository.recruitment.CandidateRepository;
import com.hrms.hr_payroll_management_system.repository.recruitment.JobPostingRepository;
import com.hrms.hr_payroll_management_system.service.recruitment.ApplicationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private static final Set<ApplicationStage> TERMINAL_STAGES =
            Set.of(ApplicationStage.HIRED, ApplicationStage.REJECTED);

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final CandidateRepository candidateRepository;
    private final JobPostingRepository jobPostingRepository;

    @Override
    public ApplicationResponse create(CreateApplicationRequest request) {

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Candidate not found.")
                );

        JobPosting jobPosting = jobPostingRepository.findById(request.getJobPostingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job posting not found.")
                );

        if (applicationRepository.existsByCandidateIdAndJobPostingId(
                candidate.getId(), jobPosting.getId())) {

            throw new DuplicateResourceException(
                    "This candidate has already applied to this job posting."
            );
        }

        Application application = Application.builder()
                .candidate(candidate)
                .jobPosting(jobPosting)
                .stage(ApplicationStage.APPLIED)
                .appliedDate(
                        request.getAppliedDate() != null
                                ? request.getAppliedDate()
                                : LocalDate.now()
                )
                .notes(request.getNotes())
                .build();

        return applicationMapper.toResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAll() {

        return applicationRepository.findAll()
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getById(Long id) {

        return applicationMapper.toResponse(getApplication(id));
    }

    @Override
    public ApplicationResponse updateStage(
            Long id,
            UpdateApplicationStageRequest request
    ) {

        Application application = getApplication(id);

        if (TERMINAL_STAGES.contains(application.getStage())) {
            throw new BadRequestException(
                    "This application has already reached a final stage ("
                            + application.getStage()
                            + ") and cannot be updated further."
            );
        }

        application.setStage(parseStage(request.getStage()));

        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        return applicationMapper.toResponse(applicationRepository.save(application));
    }

    @Override
    public void delete(Long id) {

        applicationRepository.delete(getApplication(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getByJobPostingId(Long jobPostingId) {

        if (!jobPostingRepository.existsById(jobPostingId)) {
            throw new ResourceNotFoundException("Job posting not found.");
        }

        return applicationRepository.findByJobPostingId(jobPostingId)
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getByCandidateId(Long candidateId) {

        if (!candidateRepository.existsById(candidateId)) {
            throw new ResourceNotFoundException("Candidate not found.");
        }

        return applicationRepository.findByCandidateId(candidateId)
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    private Application getApplication(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Application not found.")
                );
    }

    private ApplicationStage parseStage(String stage) {

        try {
            return ApplicationStage.valueOf(stage.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid application stage: " + stage);
        }
    }
}
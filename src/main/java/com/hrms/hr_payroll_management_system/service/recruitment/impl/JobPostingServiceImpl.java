package com.hrms.hr_payroll_management_system.service.recruitment.impl;

import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateJobPostingRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateJobPostingRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.JobPostingResponse;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.Position;
import com.hrms.hr_payroll_management_system.entity.recruitment.JobPosting;
import com.hrms.hr_payroll_management_system.enums.ApplicationStage;
import com.hrms.hr_payroll_management_system.enums.EmploymentType;
import com.hrms.hr_payroll_management_system.enums.JobPostingStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.recruitment.JobPostingMapper;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.PositionRepository;
import com.hrms.hr_payroll_management_system.repository.recruitment.ApplicationRepository;
import com.hrms.hr_payroll_management_system.repository.recruitment.JobPostingRepository;
import com.hrms.hr_payroll_management_system.service.recruitment.JobPostingService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobPostingServiceImpl implements JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final JobPostingMapper jobPostingMapper;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    public JobPostingResponse create(CreateJobPostingRequest request) {

        JobPosting jobPosting = jobPostingMapper.toEntity(request);

        jobPosting.setDepartment(resolveDepartment(request.getDepartmentId()));
        jobPosting.setPosition(resolvePosition(request.getPositionId()));
        jobPosting.setEmploymentType(parseEmploymentType(request.getEmploymentType()));
        jobPosting.setStatus(JobPostingStatus.DRAFT);

        if (jobPosting.getPostedDate() == null) {
            jobPosting.setPostedDate(LocalDate.now());
        }

        return toEnrichedResponse(jobPostingRepository.save(jobPosting));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostingResponse> getAll() {

        return jobPostingRepository.findAll()
                .stream()
                .map(this::toEnrichedResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JobPostingResponse getById(Long id) {

        return toEnrichedResponse(getJobPosting(id));
    }

    @Override
    public JobPostingResponse update(
            Long id,
            UpdateJobPostingRequest request
    ) {

        JobPosting jobPosting = getJobPosting(id);

        jobPostingMapper.updateEntity(request, jobPosting);

        jobPosting.setDepartment(resolveDepartment(request.getDepartmentId()));
        jobPosting.setPosition(resolvePosition(request.getPositionId()));
        jobPosting.setEmploymentType(parseEmploymentType(request.getEmploymentType()));

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            jobPosting.setStatus(parseStatus(request.getStatus()));
        }

        return toEnrichedResponse(jobPostingRepository.save(jobPosting));
    }

    @Override
    public void delete(Long id) {

        JobPosting jobPosting = getJobPosting(id);

        if (applicationRepository.existsByJobPostingId(id)) {
            throw new BadRequestException(
                    "Cannot delete a job posting that already has applications."
            );
        }

        jobPostingRepository.delete(jobPosting);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostingResponse> getByDepartmentId(Long departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Department not found.");
        }

        return jobPostingRepository.findByDepartmentId(departmentId)
                .stream()
                .map(this::toEnrichedResponse)
                .toList();
    }

    private JobPostingResponse toEnrichedResponse(JobPosting jobPosting) {

        JobPostingResponse response = jobPostingMapper.toResponse(jobPosting);

        response.setApplicationCount(
                applicationRepository.findByJobPostingId(jobPosting.getId()).size()
        );
        response.setHiredCount(
                applicationRepository.countByJobPostingIdAndStage(
                        jobPosting.getId(),
                        ApplicationStage.HIRED
                )
        );

        return response;
    }

    private JobPosting getJobPosting(Long id) {

        return jobPostingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job posting not found.")
                );
    }

    private Department resolveDepartment(Long departmentId) {

        return departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found.")
                );
    }

    private Position resolvePosition(Long positionId) {

        if (positionId == null) {
            return null;
        }

        return positionRepository.findById(positionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Position not found.")
                );
    }

    private EmploymentType parseEmploymentType(String employmentType) {

        try {
            return EmploymentType.valueOf(employmentType.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(
                    "Invalid employment type: " + employmentType
            );
        }
    }

    private JobPostingStatus parseStatus(String status) {

        try {
            return JobPostingStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
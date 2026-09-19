package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.onboarding.CreateOnboardingTemplateRequest;
import com.hrms.hr_payroll_management_system.dto.request.onboarding.OnboardingTemplateTaskRequest;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingTemplateResponse;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingTemplateTaskResponse;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.entity.OnboardingTemplate;
import com.hrms.hr_payroll_management_system.entity.OnboardingTemplateTask;
import com.hrms.hr_payroll_management_system.enums.Status;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.OnboardingTemplateRepository;
import com.hrms.hr_payroll_management_system.service.OnboardingTemplateService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OnboardingTemplateServiceImpl implements OnboardingTemplateService {

    private final OnboardingTemplateRepository templateRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public OnboardingTemplateResponse create(CreateOnboardingTemplateRequest request) {
        OnboardingTemplate template = buildEntity(new OnboardingTemplate(), request);
        return toResponse(templateRepository.save(template));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OnboardingTemplateResponse> getAllActive() {
        return templateRepository.findByStatus(Status.ACTIVE).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OnboardingTemplateResponse getById(Long id) {
        return toResponse(findTemplate(id));
    }

    @Override
    @Transactional
    public OnboardingTemplateResponse update(Long id, CreateOnboardingTemplateRequest request) {
        OnboardingTemplate template = findTemplate(id);
        template.getTasks().clear(); // orphanRemoval handles deleting the old rows
        return toResponse(templateRepository.save(buildEntity(template, request)));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        OnboardingTemplate template = findTemplate(id);
        template.setStatus(Status.INACTIVE); // soft delete — existing processes still reference it
        templateRepository.save(template);
    }

    private OnboardingTemplate findTemplate(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Onboarding template not found: " + id));
    }

    private OnboardingTemplate buildEntity(OnboardingTemplate template, CreateOnboardingTemplateRequest request) {
        template.setName(request.getName());
        template.setDescription(request.getDescription());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            template.setDepartment(dept);
        } else {
            template.setDepartment(null);
        }

        if (template.getTasks() == null) template.setTasks(new ArrayList<>());
        for (OnboardingTemplateTaskRequest t : request.getTasks()) {
            template.getTasks().add(OnboardingTemplateTask.builder()
                    .template(template)
                    .title(t.getTitle())
                    .description(t.getDescription())
                    .assignedRole(t.getAssignedRole())
                    .dueOffsetDays(t.getDueOffsetDays())
                    .mandatory(t.isMandatory())
                    .sequenceOrder(t.getSequenceOrder())
                    .build());
        }
        return template;
    }

    private OnboardingTemplateResponse toResponse(OnboardingTemplate t) {
        List<OnboardingTemplateTaskResponse> tasks = t.getTasks().stream()
                .sorted(Comparator.comparingInt(OnboardingTemplateTask::getSequenceOrder))
                .map(tt -> OnboardingTemplateTaskResponse.builder()
                        .id(tt.getId())
                        .title(tt.getTitle())
                        .description(tt.getDescription())
                        .assignedRole(tt.getAssignedRole().name())
                        .dueOffsetDays(tt.getDueOffsetDays())
                        .mandatory(tt.isMandatory())
                        .sequenceOrder(tt.getSequenceOrder())
                        .build())
                .collect(Collectors.toList());

        return OnboardingTemplateResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .description(t.getDescription())
                .departmentName(t.getDepartment() != null ? t.getDepartment().getName() : "Any Department")
                .status(t.getStatus().name())
                .tasks(tasks)
                .build();
    }
}
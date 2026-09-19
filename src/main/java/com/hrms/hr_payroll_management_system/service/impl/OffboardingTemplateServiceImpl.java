package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.offboarding.CreateOffboardingTemplateRequest;
import com.hrms.hr_payroll_management_system.dto.request.offboarding.OffboardingTemplateTaskRequest;
import com.hrms.hr_payroll_management_system.dto.response.offboarding.OffboardingTemplateResponse;
import com.hrms.hr_payroll_management_system.dto.response.offboarding.OffboardingTemplateTaskResponse;
import com.hrms.hr_payroll_management_system.entity.OffboardingTemplate;
import com.hrms.hr_payroll_management_system.entity.OffboardingTemplateTask;
import com.hrms.hr_payroll_management_system.enums.Status;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.OffboardingTemplateRepository;
import com.hrms.hr_payroll_management_system.service.OffboardingTemplateService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OffboardingTemplateServiceImpl implements OffboardingTemplateService {

    private final OffboardingTemplateRepository templateRepository;

    @Override
    @Transactional
    public OffboardingTemplateResponse create(CreateOffboardingTemplateRequest request) {
        OffboardingTemplate template = new OffboardingTemplate();
        template.setName(request.getName());
        template.setDescription(request.getDescription());
        template.setTasks(new ArrayList<>());

        for (OffboardingTemplateTaskRequest t : request.getTasks()) {
            template.getTasks().add(OffboardingTemplateTask.builder()
                    .template(template)
                    .title(t.getTitle())
                    .description(t.getDescription())
                    .assignedRole(t.getAssignedRole())
                    .dueOffsetDays(t.getDueOffsetDays())
                    .mandatory(t.isMandatory())
                    .sequenceOrder(t.getSequenceOrder())
                    .build());
        }

        return toResponse(templateRepository.save(template));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OffboardingTemplateResponse> getAllActive() {
        return templateRepository.findByStatus(Status.ACTIVE).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OffboardingTemplateResponse getById(Long id) {
        return toResponse(findTemplate(id));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        OffboardingTemplate template = findTemplate(id);
        template.setStatus(Status.INACTIVE); // soft delete — existing processes keep referencing it
        templateRepository.save(template);
    }

    private OffboardingTemplate findTemplate(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offboarding template not found: " + id));
    }

    private OffboardingTemplateResponse toResponse(OffboardingTemplate t) {
        List<OffboardingTemplateTaskResponse> tasks = t.getTasks().stream()
                .sorted(Comparator.comparingInt(OffboardingTemplateTask::getSequenceOrder))
                .map(tt -> OffboardingTemplateTaskResponse.builder()
                        .id(tt.getId())
                        .title(tt.getTitle())
                        .description(tt.getDescription())
                        .assignedRole(tt.getAssignedRole().name())
                        .dueOffsetDays(tt.getDueOffsetDays())
                        .mandatory(tt.isMandatory())
                        .sequenceOrder(tt.getSequenceOrder())
                        .build())
                .collect(Collectors.toList());

        return OffboardingTemplateResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .description(t.getDescription())
                .status(t.getStatus().name())
                .tasks(tasks)
                .build();
    }
}
package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.onboarding.StartOnboardingRequest;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingProcessResponse;
import com.hrms.hr_payroll_management_system.dto.response.onboarding.OnboardingTaskResponse;
import com.hrms.hr_payroll_management_system.entity.*;
import com.hrms.hr_payroll_management_system.enums.OnboardingStatus;
import com.hrms.hr_payroll_management_system.enums.OnboardingTaskStatus;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.*;
import com.hrms.hr_payroll_management_system.service.OnboardingService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OnboardingServiceImpl implements OnboardingService {

    private final OnboardingProcessRepository processRepository;
    private final OnboardingTemplateRepository templateRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public OnboardingProcessResponse start(StartOnboardingRequest request) {

        // Guard: don't let the same employee get two active onboarding
        // processes at once (double-click, duplicate call, etc).
        boolean alreadyActive = processRepository.existsByEmployeeIdAndStatusIn(
                request.getEmployeeId(),
                List.of(OnboardingStatus.NOT_STARTED, OnboardingStatus.IN_PROGRESS)
        );
        if (alreadyActive) {
            throw new IllegalStateException("Employee already has an active onboarding process.");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        OnboardingTemplate template = templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("Template not found"));

        OnboardingProcess process = OnboardingProcess.builder()
                .employee(employee)
                .template(template)
                .startDate(employee.getHireDate() != null ? employee.getHireDate() : LocalDate.now())
                .status(OnboardingStatus.IN_PROGRESS)
                .build();

        // Instantiate every template task as a concrete, dated task.
        // Due date = process start date + that task's offset — this is the
        // core "template becomes a real checklist" logic.
        List<OnboardingTask> tasks = template.getTasks().stream()
                .map(t -> OnboardingTask.builder()
                        .process(process)
                        .title(t.getTitle())
                        .description(t.getDescription())
                        .assignedRole(t.getAssignedRole())
                        .dueDate(process.getStartDate().plusDays(t.getDueOffsetDays()))
                        .mandatory(t.isMandatory())
                        .sequenceOrder(t.getSequenceOrder())
                        .status(OnboardingTaskStatus.PENDING)
                        .build())
                .collect(Collectors.toList());

        process.setTasks(tasks);
        OnboardingProcess saved = processRepository.save(process);
        return toResponse(saved);
    }

    @Override
        @Transactional(readOnly = true)
        public OnboardingProcessResponse getByEmployeeId(Long employeeId) {
        List<OnboardingProcess> processes = processRepository
                .findByEmployeeIdAndStatusNotOrderByIdDesc(employeeId, OnboardingStatus.CANCELLED);

        if (processes.isEmpty()) {
                throw new ResourceNotFoundException("No onboarding process for this employee");
        }
        return toResponse(processes.get(0)); // most recent one
        }

    @Override
    @Transactional(readOnly = true)
    public List<OnboardingProcessResponse> getActiveProcesses() {
        return processRepository.findByStatus(OnboardingStatus.IN_PROGRESS).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OnboardingProcessResponse completeTask(Long taskId, Long completedByEmployeeId) {
        OnboardingTask task = findTask(taskId);
        task.setStatus(OnboardingTaskStatus.DONE);
        task.setCompletedAt(LocalDateTime.now());

        if (completedByEmployeeId != null) {
            employeeRepository.findById(completedByEmployeeId).ifPresent(task::setCompletedBy);
        }

        OnboardingProcess process = task.getProcess();
        recalculateProcessStatus(process);
        return toResponse(process);
    }

    @Override
    @Transactional
    public OnboardingProcessResponse skipTask(Long taskId) {
        OnboardingTask task = findTask(taskId);

        // Mandatory tasks can't be skipped through this endpoint — they must
        // be completed. Prevents "onboarding complete" with real gaps in it.
        if (task.isMandatory()) {
            throw new IllegalStateException("Mandatory tasks cannot be skipped: " + task.getTitle());
        }

        task.setStatus(OnboardingTaskStatus.SKIPPED);
        OnboardingProcess process = task.getProcess();
        recalculateProcessStatus(process);
        return toResponse(process);
    }

    // ---- internal helpers ----

    private OnboardingTask findTask(Long taskId) {
        return processRepository.findAll().stream() // small dataset; swap for a dedicated
                .flatMap(p -> p.getTasks().stream())  // OnboardingTaskRepository.findById in
                .filter(t -> t.getId().equals(taskId)) // production for a direct lookup.
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
    }

    /** A process auto-completes the moment every mandatory task is DONE or
     *  SKIPPED (non-mandatory tasks don't block completion). This is what
     *  makes onboarding "close itself out" instead of needing a manual
     *  status change from HR. */
    private void recalculateProcessStatus(OnboardingProcess process) {
        boolean allMandatoryResolved = process.getTasks().stream()
                .filter(OnboardingTask::isMandatory)
                .allMatch(t -> t.getStatus() == OnboardingTaskStatus.DONE);

        if (allMandatoryResolved && process.getStatus() != OnboardingStatus.COMPLETED) {
            process.setStatus(OnboardingStatus.COMPLETED);
            process.setCompletedAt(LocalDateTime.now());
        }
    }

    private OnboardingProcessResponse toResponse(OnboardingProcess p) {
        List<OnboardingTaskResponse> taskResponses = p.getTasks().stream()
                .sorted(Comparator.comparingInt(OnboardingTask::getSequenceOrder))
                .map(t -> OnboardingTaskResponse.builder()
                        .id(t.getId())
                        .title(t.getTitle())
                        .description(t.getDescription())
                        .assignedRole(t.getAssignedRole().name())
                        .dueDate(t.getDueDate())
                        .mandatory(t.isMandatory())
                        .status(t.getStatus().name())
                        .overdue(t.getStatus() == OnboardingTaskStatus.PENDING
                                && t.getDueDate().isBefore(LocalDate.now()))
                        .build())
                .collect(Collectors.toList());

        long total = taskResponses.size();
        long done = taskResponses.stream()
                .filter(t -> t.getStatus().equals("DONE") || t.getStatus().equals("SKIPPED"))
                .count();
        int progress = total == 0 ? 0 : (int) Math.round((done * 100.0) / total);

        return OnboardingProcessResponse.builder()
                .id(p.getId())
                .employeeId(p.getEmployee().getId())
                .employeeName(p.getEmployee().getFirstName() + " " + p.getEmployee().getLastName())
                .templateName(p.getTemplate().getName())
                .startDate(p.getStartDate())
                .status(p.getStatus().name())
                .progressPercent(progress)
                .tasks(taskResponses)
                .build();
    }
    @Override
        @Transactional(readOnly = true)
        public List<OnboardingProcessResponse> getCompletedProcesses() {
        return processRepository.findByStatus(OnboardingStatus.COMPLETED).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        }
}
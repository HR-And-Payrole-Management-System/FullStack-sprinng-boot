package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.offboarding.StartOffboardingRequest;
import com.hrms.hr_payroll_management_system.dto.response.offboarding.OffboardingProcessResponse;
import com.hrms.hr_payroll_management_system.dto.response.offboarding.OffboardingTaskResponse;
import com.hrms.hr_payroll_management_system.entity.*;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.OffboardingReason;
import com.hrms.hr_payroll_management_system.enums.OffboardingStatus;
import com.hrms.hr_payroll_management_system.enums.OffboardingTaskStatus;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.*;
import com.hrms.hr_payroll_management_system.service.OffboardingService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OffboardingServiceImpl implements OffboardingService {

    private final OffboardingProcessRepository processRepository;
    private final OffboardingTemplateRepository templateRepository;
    private final EmployeeRepository employeeRepository;

    // Maps the business reason for leaving to the final Employee.status —
    // kept explicit here rather than a switch buried in logic, so HR policy
    // changes (e.g. treating layoffs as INACTIVE not TERMINATED) are a
    // one-line edit.
    private static final Map<OffboardingReason, EmployeeStatus> STATUS_MAP = new EnumMap<>(OffboardingReason.class);
    static {
        STATUS_MAP.put(OffboardingReason.RESIGNATION, EmployeeStatus.RESIGNED);
        STATUS_MAP.put(OffboardingReason.TERMINATION, EmployeeStatus.TERMINATED);
        STATUS_MAP.put(OffboardingReason.LAYOFF, EmployeeStatus.TERMINATED);
        STATUS_MAP.put(OffboardingReason.RETIREMENT, EmployeeStatus.INACTIVE);
        STATUS_MAP.put(OffboardingReason.CONTRACT_END, EmployeeStatus.INACTIVE);
    }

    @Override
    @Transactional
    public OffboardingProcessResponse start(StartOffboardingRequest request) {

        boolean alreadyActive = processRepository.existsByEmployeeIdAndStatusIn(
                request.getEmployeeId(),
                List.of(OffboardingStatus.NOT_STARTED, OffboardingStatus.IN_PROGRESS)
        );
        if (alreadyActive) {
            throw new IllegalStateException("Employee already has an active offboarding process.");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        OffboardingTemplate template = templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("Template not found"));

        OffboardingProcess process = OffboardingProcess.builder()
                .employee(employee)
                .template(template)
                .reason(request.getReason())
                .lastWorkingDate(request.getLastWorkingDate())
                .status(OffboardingStatus.IN_PROGRESS)
                .build();

        List<OffboardingTask> tasks = template.getTasks().stream()
                .map(t -> OffboardingTask.builder()
                        .process(process)
                        .title(t.getTitle())
                        .description(t.getDescription())
                        .assignedRole(t.getAssignedRole())
                        .dueDate(request.getLastWorkingDate().plusDays(t.getDueOffsetDays()))
                        .mandatory(t.isMandatory())
                        .sequenceOrder(t.getSequenceOrder())
                        .status(OffboardingTaskStatus.PENDING)
                        .build())
                .collect(Collectors.toList());

        process.setTasks(tasks);
        OffboardingProcess saved = processRepository.save(process);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public OffboardingProcessResponse getByEmployeeId(Long employeeId) {
        OffboardingProcess process = processRepository
                .findByEmployeeIdAndStatusNot(employeeId, OffboardingStatus.CANCELLED)
                .orElseThrow(() -> new ResourceNotFoundException("No offboarding process for this employee"));
        return toResponse(process);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OffboardingProcessResponse> getActiveProcesses() {
        return processRepository.findByStatus(OffboardingStatus.IN_PROGRESS).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OffboardingProcessResponse completeTask(Long taskId, Long completedByEmployeeId) {
        OffboardingTask task = findTask(taskId);
        task.setStatus(OffboardingTaskStatus.DONE);
        task.setCompletedAt(LocalDateTime.now());

        if (completedByEmployeeId != null) {
            employeeRepository.findById(completedByEmployeeId).ifPresent(task::setCompletedBy);
        }

        OffboardingProcess process = task.getProcess();
        recalculateProcessStatus(process);
        return toResponse(process);
    }

    @Override
    @Transactional
    public OffboardingProcessResponse skipTask(Long taskId) {
        OffboardingTask task = findTask(taskId);
        if (task.isMandatory()) {
            throw new IllegalStateException("Mandatory tasks cannot be skipped: " + task.getTitle());
        }
        task.setStatus(OffboardingTaskStatus.SKIPPED);
        OffboardingProcess process = task.getProcess();
        recalculateProcessStatus(process);
        return toResponse(process);
    }

    // ---- internal helpers ----

    private OffboardingTask findTask(Long taskId) {
        return processRepository.findAll().stream()
                .flatMap(p -> p.getTasks().stream())
                .filter(t -> t.getId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
    }

    private void recalculateProcessStatus(OffboardingProcess process) {
        boolean allMandatoryResolved = process.getTasks().stream()
                .filter(OffboardingTask::isMandatory)
                .allMatch(t -> t.getStatus() == OffboardingTaskStatus.DONE);

        if (allMandatoryResolved && process.getStatus() != OffboardingStatus.COMPLETED) {
            process.setStatus(OffboardingStatus.COMPLETED);
            process.setCompletedAt(LocalDateTime.now());
            finalizeSeparation(process); // <-- the cross-module cascade
        }
    }

    /** The actual enterprise payoff: once every mandatory offboarding task is
     *  done, the employee's record and login access are updated automatically
     *  — HR doesn't need a second manual step to actually separate them. */
    private void finalizeSeparation(OffboardingProcess process) {
        Employee employee = process.getEmployee();

        employee.setStatus(STATUS_MAP.getOrDefault(process.getReason(), EmployeeStatus.INACTIVE));
        employee.setSeparationDate(process.getLastWorkingDate());
        employee.setStatusReason(process.getReason().name());
        employee.setStatusEffectiveDate(LocalDate.now());

        if (employee.getUser() != null) {
            employee.getUser().setEnabled(false); // revoke login immediately
        }

        employeeRepository.save(employee);
    }

    private OffboardingProcessResponse toResponse(OffboardingProcess p) {
        List<OffboardingTaskResponse> taskResponses = p.getTasks().stream()
                .sorted(Comparator.comparingInt(OffboardingTask::getSequenceOrder))
                .map(t -> OffboardingTaskResponse.builder()
                        .id(t.getId())
                        .title(t.getTitle())
                        .description(t.getDescription())
                        .assignedRole(t.getAssignedRole().name())
                        .dueDate(t.getDueDate())
                        .mandatory(t.isMandatory())
                        .status(t.getStatus().name())
                        .overdue(t.getStatus() == OffboardingTaskStatus.PENDING
                                && t.getDueDate().isBefore(LocalDate.now()))
                        .build())
                .collect(Collectors.toList());

        long total = taskResponses.size();
        long done = taskResponses.stream()
                .filter(t -> t.getStatus().equals("DONE") || t.getStatus().equals("SKIPPED"))
                .count();
        int progress = total == 0 ? 0 : (int) Math.round((done * 100.0) / total);

        return OffboardingProcessResponse.builder()
                .id(p.getId())
                .employeeId(p.getEmployee().getId())
                .employeeName(p.getEmployee().getFirstName() + " " + p.getEmployee().getLastName())
                .templateName(p.getTemplate().getName())
                .reason(p.getReason().name())
                .lastWorkingDate(p.getLastWorkingDate())
                .status(p.getStatus().name())
                .progressPercent(progress)
                .tasks(taskResponses)
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public List<OffboardingProcessResponse> getCompletedProcesses() {
        return processRepository.findByStatus(OffboardingStatus.COMPLETED).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

}
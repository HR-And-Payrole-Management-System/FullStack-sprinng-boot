package com.hrms.hr_payroll_management_system.service.okr.impl;

import com.hrms.hr_payroll_management_system.dto.request.okr.CreateKeyResultRequest;
import com.hrms.hr_payroll_management_system.dto.request.okr.CreateObjectiveRequest;
import com.hrms.hr_payroll_management_system.dto.request.okr.UpdateKeyResultProgressRequest;
import com.hrms.hr_payroll_management_system.dto.response.okr.KeyResultResponse;
import com.hrms.hr_payroll_management_system.dto.response.okr.ObjectiveResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.okr.KeyResult;
import com.hrms.hr_payroll_management_system.entity.okr.Objective;
import com.hrms.hr_payroll_management_system.entity.okr.OkrCycle;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.okr.KeyResultRepository;
import com.hrms.hr_payroll_management_system.repository.okr.ObjectiveRepository;
import com.hrms.hr_payroll_management_system.repository.okr.OkrCycleRepository;
import com.hrms.hr_payroll_management_system.service.okr.OkrService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OkrServiceImpl implements OkrService {

    private final ObjectiveRepository objectiveRepository;
    private final KeyResultRepository keyResultRepository;
    private final OkrCycleRepository okrCycleRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public ObjectiveResponse createObjective(CreateObjectiveRequest request) {
        OkrCycle cycle = okrCycleRepository.findById(request.getCycleId())
                .orElseThrow(() -> new ResourceNotFoundException("OKR cycle not found"));
        Employee owner = employeeRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner employee not found"));

        Objective objective = Objective.builder()
                .cycle(cycle)
                .owner(owner)
                .title(request.getTitle())
                .description(request.getDescription())
                .build();

        if (request.getParentObjectiveId() != null) {
            Objective parent = objectiveRepository.findById(request.getParentObjectiveId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent objective not found"));
            objective.setParentObjective(parent);
        }

        return toResponse(objectiveRepository.save(objective));
    }

    @Override
    @Transactional
    public ObjectiveResponse addKeyResult(Long objectiveId, CreateKeyResultRequest request) {
        Objective objective = findObjective(objectiveId);

        KeyResult kr = KeyResult.builder()
                .objective(objective)
                .title(request.getTitle())
                .metricType(request.getMetricType())
                .startValue(request.getStartValue())
                .targetValue(request.getTargetValue())
                .currentValue(request.getStartValue())
                .unit(request.getUnit())
                .build();

        objective.getKeyResults().add(kr);
        keyResultRepository.save(kr);
        return toResponse(objective);
    }

    @Override
    @Transactional
    public ObjectiveResponse updateKeyResultProgress(Long keyResultId, UpdateKeyResultProgressRequest request) {
        KeyResult kr = keyResultRepository.findById(keyResultId)
                .orElseThrow(() -> new ResourceNotFoundException("Key result not found"));
        kr.setCurrentValue(request.getCurrentValue());
        keyResultRepository.save(kr);
        return toResponse(kr.getObjective());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ObjectiveResponse> getTopLevelForCycle(Long cycleId) {
        return objectiveRepository.findByParentObjectiveIsNullAndCycleId(cycleId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ObjectiveResponse> getForOwner(Long ownerId, Long cycleId) {
        return objectiveRepository.findByOwnerIdAndCycleId(ownerId, cycleId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Objective findObjective(Long id) {
        return objectiveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Objective not found: " + id));
    }

    /** Each key result's own progress: how far current is between start and
     *  target, clamped to 0-100 (works whether the metric counts up or the
     *  target is below start, e.g. "reduce churn from 8% to 3%"). */
    private int keyResultProgress(KeyResult kr) {
        BigDecimal range = kr.getTargetValue().subtract(kr.getStartValue());
        if (range.compareTo(BigDecimal.ZERO) == 0) return 100; // already at target by definition

        BigDecimal achieved = kr.getCurrentValue().subtract(kr.getStartValue())
                .divide(range, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        return achieved.max(BigDecimal.ZERO).min(BigDecimal.valueOf(100)).intValue();
    }

    /** The real OKR logic: an objective's progress is NEVER typed in by a
     *  human. If it has its own key results, progress = their average. If
     *  it has no key results of its own but has aligned children (a company
     *  objective made of several team objectives), progress rolls up as the
     *  average of those children instead — recursively. */
    private int computeObjectiveProgress(Objective o) {
        if (!o.getKeyResults().isEmpty()) {
            return (int) Math.round(o.getKeyResults().stream()
                    .mapToInt(this::keyResultProgress)
                    .average()
                    .orElse(0));
        }
        if (!o.getAlignedChildren().isEmpty()) {
            return (int) Math.round(o.getAlignedChildren().stream()
                    .mapToInt(this::computeObjectiveProgress)
                    .average()
                    .orElse(0));
        }
        return 0;
    }

    private ObjectiveResponse toResponse(Objective o) {
        List<KeyResultResponse> krResponses = o.getKeyResults().stream()
                .map(kr -> KeyResultResponse.builder()
                        .id(kr.getId())
                        .title(kr.getTitle())
                        .metricType(kr.getMetricType().name())
                        .startValue(kr.getStartValue())
                        .targetValue(kr.getTargetValue())
                        .currentValue(kr.getCurrentValue())
                        .unit(kr.getUnit())
                        .progressPercent(keyResultProgress(kr))
                        .build())
                .collect(Collectors.toList());

        List<ObjectiveResponse> children = o.getAlignedChildren().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ObjectiveResponse.builder()
                .id(o.getId())
                .title(o.getTitle())
                .description(o.getDescription())
                .ownerId(o.getOwner().getId())
                .ownerName(o.getOwner().getFirstName() + " " + o.getOwner().getLastName())
                .parentObjectiveId(o.getParentObjective() != null ? o.getParentObjective().getId() : null)
                .parentObjectiveTitle(o.getParentObjective() != null ? o.getParentObjective().getTitle() : null)
                .progressPercent(computeObjectiveProgress(o))
                .keyResults(krResponses)
                .alignedChildren(children)
                .build();
    }
}
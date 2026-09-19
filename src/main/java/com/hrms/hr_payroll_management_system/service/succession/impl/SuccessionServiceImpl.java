package com.hrms.hr_payroll_management_system.service.succession.impl;

import com.hrms.hr_payroll_management_system.dto.request.succession.AddSuccessionCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.request.succession.CreateKeyPositionRequest;
import com.hrms.hr_payroll_management_system.dto.response.succession.KeyPositionResponse;
import com.hrms.hr_payroll_management_system.dto.response.succession.SuccessionCandidateResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.Position;
import com.hrms.hr_payroll_management_system.entity.performance.PerformanceReview;
import com.hrms.hr_payroll_management_system.entity.succession.KeyPosition;
import com.hrms.hr_payroll_management_system.entity.succession.SuccessionCandidate;
import com.hrms.hr_payroll_management_system.enums.PerformanceReviewStatus;
import com.hrms.hr_payroll_management_system.enums.PotentialRating;
import com.hrms.hr_payroll_management_system.enums.ReadinessLevel;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.PositionRepository;
import com.hrms.hr_payroll_management_system.repository.performance.PerformanceReviewRepository;
import com.hrms.hr_payroll_management_system.repository.succession.KeyPositionRepository;
import com.hrms.hr_payroll_management_system.repository.succession.SuccessionCandidateRepository;
import com.hrms.hr_payroll_management_system.service.succession.SuccessionService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuccessionServiceImpl implements SuccessionService {

    private final KeyPositionRepository keyPositionRepository;
    private final EmployeeRepository employeeRepository;
    private final PositionRepository positionRepository;
    private final PerformanceReviewRepository performanceReviewRepository;
    private final SuccessionCandidateRepository successionCandidateRepository;

    @Override
    @Transactional
    public KeyPositionResponse createKeyPosition(CreateKeyPositionRequest request) {
        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("Position not found"));

        KeyPosition keyPosition = KeyPosition.builder()
                .position(position)
                .criticality(request.getCriticality())
                .notes(request.getNotes())
                .build();

        if (request.getCurrentHolderId() != null) {
            Employee holder = employeeRepository.findById(request.getCurrentHolderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Current holder employee not found"));
            keyPosition.setCurrentHolder(holder);
        }

        return toResponse(keyPositionRepository.save(keyPosition));
    }
    @Override
        @Transactional
        public KeyPositionResponse addCandidate(Long keyPositionId, AddSuccessionCandidateRequest request) {
        KeyPosition keyPosition = findKeyPosition(keyPositionId);
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        SuccessionCandidate candidate = SuccessionCandidate.builder()
                .keyPosition(keyPosition)
                .employee(employee)
                .potentialRating(request.getPotentialRating())
                .readiness(request.getReadiness())
                .developmentNotes(request.getDevelopmentNotes())
                .build();

        keyPosition.getCandidates().add(candidate);
        keyPositionRepository.save(keyPosition);
        return toResponse(keyPosition);
        }

    @Override
        @Transactional
        public KeyPositionResponse updateKeyPosition(Long id, CreateKeyPositionRequest request) {
        KeyPosition keyPosition = findKeyPosition(id);

        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("Position not found"));
        keyPosition.setPosition(position);
        keyPosition.setCriticality(request.getCriticality());
        keyPosition.setNotes(request.getNotes());

        if (request.getCurrentHolderId() != null) {
                Employee holder = employeeRepository.findById(request.getCurrentHolderId())
                        .orElseThrow(() -> new ResourceNotFoundException("Current holder employee not found"));
                keyPosition.setCurrentHolder(holder);
        } else {
                keyPosition.setCurrentHolder(null);
        }

        return toResponse(keyPositionRepository.save(keyPosition));
        }

        @Override
        @Transactional
        public void deleteKeyPosition(Long id) {
        keyPositionRepository.delete(findKeyPosition(id));
        }

        @Override
        @Transactional
        public KeyPositionResponse updateCandidate(Long candidateId, AddSuccessionCandidateRequest request) {
        SuccessionCandidate candidate = successionCandidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found: " + candidateId));

        if (!candidate.getEmployee().getId().equals(request.getEmployeeId())) {
                Employee employee = employeeRepository.findById(request.getEmployeeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
                candidate.setEmployee(employee);
        }
        candidate.setPotentialRating(request.getPotentialRating());
        candidate.setReadiness(request.getReadiness());
        candidate.setDevelopmentNotes(request.getDevelopmentNotes());

        successionCandidateRepository.save(candidate);
        return toResponse(candidate.getKeyPosition());
        }

        @Override
        @Transactional
        public void deleteCandidate(Long candidateId) {
        SuccessionCandidate candidate = successionCandidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found: " + candidateId));
        successionCandidateRepository.delete(candidate);
        }
    @Override
    @Transactional(readOnly = true)
    public List<KeyPositionResponse> getAll() {
        return keyPositionRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KeyPositionResponse> getAtRisk() {
        return getAll().stream()
                .filter(KeyPositionResponse::isAtRisk)
                .collect(Collectors.toList());
    }

    private KeyPosition findKeyPosition(Long id) {
        return keyPositionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Key position not found: " + id));
    }

    /** Pulls the employee's most recent COMPLETED review score — never
     *  guessed, never stored redundantly on the candidate row, so it's
     *  always current as of whenever this is viewed. */
    private BigDecimal latestPerformanceScore(Long employeeId) {
        return performanceReviewRepository.findByEmployeeIdOrderByIdDesc(employeeId).stream()
                .filter(r -> r.getStatus() == PerformanceReviewStatus.COMPLETED && r.getFinalScore() != null)
                .findFirst()
                .map(PerformanceReview::getFinalScore)
                .orElse(null);
    }

    private String performanceBand(BigDecimal score) {
        if (score == null) return "NO_DATA";
        if (score.compareTo(BigDecimal.valueOf(80)) >= 0) return "HIGH";
        if (score.compareTo(BigDecimal.valueOf(50)) >= 0) return "MEDIUM";
        return "LOW";
    }

    /** The actual 9-box placement: performance (from real review data)
     *  crossed with potential (HR's assessment). This is computed fresh
     *  every time, never persisted, so it can never go stale. */
    private String nineBoxLabel(String performanceBand, PotentialRating potential) {
        if ("NO_DATA".equals(performanceBand)) return "Unrated (no completed review yet)";

        boolean highPerf = "HIGH".equals(performanceBand);
        boolean medPerf = "MEDIUM".equals(performanceBand);

        if (highPerf && potential == PotentialRating.HIGH) return "Star";
        if (highPerf && potential == PotentialRating.MEDIUM) return "High Performer";
        if (highPerf && potential == PotentialRating.LOW) return "Trusted Professional";
        if (medPerf && potential == PotentialRating.HIGH) return "High Potential";
        if (medPerf && potential == PotentialRating.MEDIUM) return "Core Player";
        if (medPerf && potential == PotentialRating.LOW) return "Effective";
        if (potential == PotentialRating.HIGH) return "Rough Diamond"; // low perf, high potential
        if (potential == PotentialRating.MEDIUM) return "Inconsistent Player";
        return "Risk"; // low perf, low potential
    }
        private List<String> reportingChain(Employee holder) {
        List<String> chain = new java.util.ArrayList<>();
        Employee current = holder != null ? holder.getManager() : null;
        int depth = 0;
        while (current != null && depth < 5) {
                chain.add(current.getFirstName() + " " + current.getLastName());
                current = current.getManager();
                depth++;
        }
        return chain;
        }

    private KeyPositionResponse toResponse(KeyPosition kp) {
        List<SuccessionCandidateResponse> candidates = kp.getCandidates().stream()
                .map(c -> {
                    BigDecimal score = latestPerformanceScore(c.getEmployee().getId());
                    String band = performanceBand(score);
                    return SuccessionCandidateResponse.builder()
                            .id(c.getId())
                            .employeeId(c.getEmployee().getId())
                            .employeeName(c.getEmployee().getFirstName() + " " + c.getEmployee().getLastName())
                            .potentialRating(c.getPotentialRating().name())
                            .readiness(c.getReadiness().name())
                            .developmentNotes(c.getDevelopmentNotes())
                            .latestPerformanceScore(score)
                            .performanceBand(band)
                            .nineBoxLabel(nineBoxLabel(band, c.getPotentialRating()))
                            .build();
                })
                .collect(Collectors.toList());

        // Bench-strength check: this position is at risk if nobody is
        // rated READY_NOW — the whole point of succession planning is
        // knowing this BEFORE the seat becomes vacant.
        boolean hasReadyNow = candidates.stream()
                .anyMatch(c -> ReadinessLevel.READY_NOW.name().equals(c.getReadiness()));

        return KeyPositionResponse.builder()
        .id(kp.getId())
        .positionName(kp.getPosition().getName())
        .currentHolderId(kp.getCurrentHolder() != null ? kp.getCurrentHolder().getId() : null)
        .currentHolderName(kp.getCurrentHolder() != null
                ? kp.getCurrentHolder().getFirstName() + " " + kp.getCurrentHolder().getLastName() : "Vacant")
        .criticality(kp.getCriticality().name())
        .notes(kp.getNotes())
        .atRisk(!hasReadyNow)
        .candidates(candidates)
        .reportingChain(reportingChain(kp.getCurrentHolder()))
        .build();
    }

}
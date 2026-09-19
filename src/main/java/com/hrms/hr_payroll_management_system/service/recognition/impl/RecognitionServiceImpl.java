package com.hrms.hr_payroll_management_system.service.recognition.impl;

import com.hrms.hr_payroll_management_system.dto.request.recognition.GiveRecognitionRequest;
import com.hrms.hr_payroll_management_system.dto.response.recognition.*;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.recognition.CoreValue;
import com.hrms.hr_payroll_management_system.entity.recognition.Recognition;
import com.hrms.hr_payroll_management_system.entity.recognition.RecognitionLike;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.recognition.CoreValueRepository;
import com.hrms.hr_payroll_management_system.repository.recognition.RecognitionLikeRepository;
import com.hrms.hr_payroll_management_system.repository.recognition.RecognitionRepository;
import com.hrms.hr_payroll_management_system.service.recognition.RecognitionService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecognitionServiceImpl implements RecognitionService {

    // A hard monthly cap every employee gets to GIVE away — the actual
    // enterprise constraint. Kept as a constant here; a real system would
    // pull this from a settings table, same caveat as Expense's category
    // caps in Phase 5.
    private static final int MONTHLY_GIVING_BUDGET = 100;

    private final RecognitionRepository recognitionRepository;
    private final RecognitionLikeRepository likeRepository;
    private final EmployeeRepository employeeRepository;
    private final CoreValueRepository coreValueRepository;

    @Override
    @Transactional
    public RecognitionResponse give(GiveRecognitionRequest request) {
        if (request.getGiverId().equals(request.getReceiverId())) {
            throw new IllegalStateException("You cannot give recognition to yourself.");
        }

        Employee giver = employeeRepository.findById(request.getGiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Giver not found"));
        Employee receiver = employeeRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        int remaining = remainingBudget(request.getGiverId());
        if (request.getPoints() > remaining) {
            throw new IllegalStateException(
                    "Not enough points remaining this month. You have " + remaining + " left, tried to give " + request.getPoints() + ".");
        }

        Recognition recognition = Recognition.builder()
                .giver(giver)
                .receiver(receiver)
                .message(request.getMessage())
                .points(request.getPoints())
                .build();

        if (request.getCoreValueId() != null) {
            CoreValue value = coreValueRepository.findById(request.getCoreValueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Core value not found"));
            recognition.setCoreValue(value);
        }

        return toResponse(recognitionRepository.save(recognition));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecognitionResponse> getFeed() {
        return recognitionRepository.findAllByOrderByIdDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GiverBudgetResponse getBudget(Long employeeId) {
        int remaining = remainingBudget(employeeId);
        return GiverBudgetResponse.builder()
                .monthlyBudget(MONTHLY_GIVING_BUDGET)
                .pointsGivenThisMonth(MONTHLY_GIVING_BUDGET - remaining)
                .pointsRemaining(remaining)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardEntryResponse> getMonthlyLeaderboard() {
        LocalDateTime[] range = currentMonthRange();
        List<Recognition> monthRecognitions = recognitionRepository.findByCreatedAtBetween(range[0], range[1]);

        Map<Employee, List<Recognition>> byReceiver = monthRecognitions.stream()
                .collect(Collectors.groupingBy(Recognition::getReceiver));

        return byReceiver.entrySet().stream()
                .map(entry -> LeaderboardEntryResponse.builder()
                        .employeeId(entry.getKey().getId())
                        .employeeName(entry.getKey().getFirstName() + " " + entry.getKey().getLastName())
                        .totalPoints(entry.getValue().stream().mapToInt(Recognition::getPoints).sum())
                        .recognitionCount(entry.getValue().size())
                        .build())
                .sorted(Comparator.comparingInt(LeaderboardEntryResponse::getTotalPoints).reversed())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RecognitionResponse toggleLike(Long recognitionId, Long employeeId) {
        Recognition recognition = recognitionRepository.findById(recognitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Recognition not found: " + recognitionId));

        likeRepository.findByRecognitionIdAndEmployeeId(recognitionId, employeeId).ifPresentOrElse(
                like -> recognition.getLikes().remove(like), // unlike
                () -> {
                    Employee employee = employeeRepository.findById(employeeId)
                            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
                    recognition.getLikes().add(RecognitionLike.builder().recognition(recognition).employee(employee).build());
                }
        );

        return toResponse(recognitionRepository.save(recognition));
    }

    /** The actual budget check: how many points has this employee already
     *  GIVEN (not received) so far this calendar month? */
    private int remainingBudget(Long giverId) {
        LocalDateTime[] range = currentMonthRange();
        int givenThisMonth = recognitionRepository
                .findByGiverIdAndCreatedAtBetween(giverId, range[0], range[1]).stream()
                .mapToInt(Recognition::getPoints)
                .sum();
        return Math.max(0, MONTHLY_GIVING_BUDGET - givenThisMonth);
    }

    private LocalDateTime[] currentMonthRange() {
        YearMonth month = YearMonth.now();
        return new LocalDateTime[]{ month.atDay(1).atStartOfDay(), month.atEndOfMonth().atTime(23, 59, 59) };
    }

    private RecognitionResponse toResponse(Recognition r) {
        return RecognitionResponse.builder()
                .id(r.getId())
                .giverName(r.getGiver().getFirstName() + " " + r.getGiver().getLastName())
                .receiverName(r.getReceiver().getFirstName() + " " + r.getReceiver().getLastName())
                .coreValueName(r.getCoreValue() != null ? r.getCoreValue().getName() : null)
                .coreValueIcon(r.getCoreValue() != null ? r.getCoreValue().getIcon() : null)
                .message(r.getMessage())
                .points(r.getPoints())
                .likeCount(r.getLikes().size())
                .createdAt(r.getCreatedAt()) // adjust field name if BaseEntity differs
                .build();
    }
}
package com.hrms.hr_payroll_management_system.service.performance.impl;

import com.hrms.hr_payroll_management_system.dto.request.performance.ManagerReviewRequest;
import com.hrms.hr_payroll_management_system.dto.request.performance.SelfReviewRequest;
import com.hrms.hr_payroll_management_system.dto.response.performance.PerformanceReviewResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.performance.PerformanceCycle;
import com.hrms.hr_payroll_management_system.entity.performance.PerformanceGoal;
import com.hrms.hr_payroll_management_system.entity.performance.PerformanceReview;
import com.hrms.hr_payroll_management_system.enums.AuditAction;
import com.hrms.hr_payroll_management_system.enums.PerformanceReviewStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.performance.PerformanceCycleRepository;
import com.hrms.hr_payroll_management_system.repository.performance.PerformanceGoalRepository;
import com.hrms.hr_payroll_management_system.repository.performance.PerformanceReviewRepository;
import com.hrms.hr_payroll_management_system.service.audit.AuditLogService;
import com.hrms.hr_payroll_management_system.service.performance.PerformanceReviewService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceReviewServiceImpl
        implements PerformanceReviewService {

    private final PerformanceReviewRepository reviewRepository;
    private final PerformanceGoalRepository goalRepository;
    private final PerformanceCycleRepository cycleRepository;
    private final EmployeeRepository employeeRepository;
private final AuditLogService auditLogService;
    @Override
    public PerformanceReviewResponse selfReview(
            Long employeeId,
            Long cycleId,
            SelfReviewRequest request
    ) {

        PerformanceReview review =
                getOrCreate(
                        employeeId,
                        cycleId
                );

        if (review.getStatus()
                == PerformanceReviewStatus.COMPLETED) {

            throw new BadRequestException(
                    "Completed review cannot be modified."
            );
        }

        review.setSelfRating(
                request.getRating()
        );

        review.setSelfComment(
                request.getComment()
        );

        review.setStatus(
                PerformanceReviewStatus.SELF_REVIEWED
        );

        return map(
                reviewRepository.save(review)
        );
    }

    @Override
    public PerformanceReviewResponse managerReview(
            Long employeeId,
            Long cycleId,
            ManagerReviewRequest request
    ) {

        PerformanceReview review =
                getOrCreate(
                        employeeId,
                        cycleId
                );

        if (review.getSelfRating() == null) {
            throw new BadRequestException(
                    "Employee self review must be completed first."
            );
        }

        if (review.getStatus()
                == PerformanceReviewStatus.COMPLETED) {

            throw new BadRequestException(
                    "Completed review cannot be modified."
            );
        }

        review.setManagerRating(
                request.getRating()
        );

        review.setManagerComment(
                request.getComment()
        );

        review.setStatus(
                PerformanceReviewStatus.MANAGER_REVIEWED
        );

       PerformanceReview saved =
        reviewRepository.save(review);

        auditLogService.log(
                AuditAction.UPDATE,
                "PERFORMANCE_REVIEW",
                saved.getId(),
                "Manager review submitted."
        );

        return map(saved);
                
        }

    @Override
    public PerformanceReviewResponse complete(
            Long employeeId,
            Long cycleId
    ) {

        PerformanceReview review =
                reviewRepository
                        .findByEmployeeIdAndCycleId(
                                employeeId,
                                cycleId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Performance review not found."
                                )
                        );

        if (review.getSelfRating() == null) {
            throw new BadRequestException(
                    "Self review is required."
            );
        }

        if (review.getManagerRating() == null) {
            throw new BadRequestException(
                    "Manager review is required."
            );
        }

        BigDecimal goalScore =
                calculateGoalScore(
                        employeeId,
                        cycleId
                );

        review.setGoalScore(goalScore);

        /*
         * Final score:
         * Goal = 50%
         * Manager rating = 40%
         * Self rating = 10%
         *
         * Ratings are 1-5.
         * Convert rating to percentage first.
         */

        BigDecimal managerPercentage =
                review.getManagerRating()
                        .divide(
                                BigDecimal.valueOf(5),
                                10,
                                RoundingMode.HALF_UP
                        )
                        .multiply(
                                BigDecimal.valueOf(100)
                        );

        BigDecimal selfPercentage =
                review.getSelfRating()
                        .divide(
                                BigDecimal.valueOf(5),
                                10,
                                RoundingMode.HALF_UP
                        )
                        .multiply(
                                BigDecimal.valueOf(100)
                        );

        BigDecimal finalScore =
                goalScore.multiply(
                        BigDecimal.valueOf(0.50)
                )
                .add(
                        managerPercentage.multiply(
                                BigDecimal.valueOf(0.40)
                        )
                )
                .add(
                        selfPercentage.multiply(
                                BigDecimal.valueOf(0.10)
                        )
                )
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        review.setFinalScore(
                finalScore
        );

        review.setStatus(
                PerformanceReviewStatus.COMPLETED
        );

        review.setCompletedAt(
                LocalDateTime.now()
        );

        PerformanceReview saved =
        reviewRepository.save(review);

        auditLogService.log(
                AuditAction.PROCESS,
                "PERFORMANCE_REVIEW",
                saved.getId(),
                "Performance review completed."
        );

        return map(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PerformanceReviewResponse get(
            Long employeeId,
            Long cycleId
    ) {

        return reviewRepository
                .findByEmployeeIdAndCycleId(
                        employeeId,
                        cycleId
                )
                .map(this::map)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Performance review not found."
                        )
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerformanceReviewResponse> getHistory(
            Long employeeId
    ) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException(
                    "Employee not found."
            );
        }

        return reviewRepository
                .findByEmployeeIdOrderByIdDesc(
                        employeeId
                )
                .stream()
                .map(this::map)
                .toList();
    }

    private PerformanceReview getOrCreate(
            Long employeeId,
            Long cycleId
    ) {

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found."
                                )
                        );

        PerformanceCycle cycle =
                cycleRepository.findById(cycleId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Performance cycle not found."
                                )
                        );

        return reviewRepository
                .findByEmployeeIdAndCycleId(
                        employeeId,
                        cycleId
                )
                .orElseGet(() ->
                        reviewRepository.save(
                                PerformanceReview.builder()
                                        .employee(employee)
                                        .cycle(cycle)
                                        .status(
                                                PerformanceReviewStatus.PENDING
                                        )
                                        .build()
                        )
                );
    }

    private BigDecimal calculateGoalScore(
            Long employeeId,
            Long cycleId
    ) {

        List<PerformanceGoal> goals =
                goalRepository
                        .findByEmployeeIdAndCycleId(
                                employeeId,
                                cycleId
                        );

        if (goals.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal weightedScore =
                BigDecimal.ZERO;

        BigDecimal totalWeight =
                BigDecimal.ZERO;

        for (PerformanceGoal goal : goals) {

            weightedScore =
                    weightedScore.add(
                            goal.getProgress()
                                    .multiply(
                                            goal.getWeight()
                                    )
                    );

            totalWeight =
                    totalWeight.add(
                            goal.getWeight()
                    );
        }

        if (totalWeight.compareTo(
                BigDecimal.ZERO
        ) == 0) {
            return BigDecimal.ZERO;
        }

        return weightedScore
                .divide(
                        totalWeight,
                        2,
                        RoundingMode.HALF_UP
                );
    }

    private PerformanceReviewResponse map(
            PerformanceReview review
    ) {

        Employee employee =
                review.getEmployee();

        return PerformanceReviewResponse.builder()
                .id(review.getId())
                .employeeId(employee.getId())
                .employeeCode(
                        employee.getEmployeeCode()
                )
                .employeeName(
                        employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )
                .cycleId(
                        review.getCycle().getId()
                )
                .cycleName(
                        review.getCycle().getName()
                )
                .selfRating(
                        review.getSelfRating()
                )
                .selfComment(
                        review.getSelfComment()
                )
                .managerRating(
                        review.getManagerRating()
                )
                .managerComment(
                        review.getManagerComment()
                )
                .goalScore(
                        review.getGoalScore()
                )
                .finalScore(
                        review.getFinalScore()
                )
                .status(
                        review.getStatus().name()
                )
                .build();
    }
}
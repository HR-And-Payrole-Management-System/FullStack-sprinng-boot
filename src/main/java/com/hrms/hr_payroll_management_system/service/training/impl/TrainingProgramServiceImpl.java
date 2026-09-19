package com.hrms.hr_payroll_management_system.service.training.impl;

import com.hrms.hr_payroll_management_system.dto.request.training.CreateTrainingProgramRequest;
import com.hrms.hr_payroll_management_system.dto.request.training.UpdateTrainingProgramRequest;
import com.hrms.hr_payroll_management_system.dto.response.training.TrainingProgramResponse;
import com.hrms.hr_payroll_management_system.entity.training.TrainingProgram;
import com.hrms.hr_payroll_management_system.enums.Status;
import com.hrms.hr_payroll_management_system.enums.TrainingEnrollmentStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.training.TrainingProgramMapper;
import com.hrms.hr_payroll_management_system.repository.training.TrainingEnrollmentRepository;
import com.hrms.hr_payroll_management_system.repository.training.TrainingProgramRepository;
import com.hrms.hr_payroll_management_system.service.training.TrainingProgramService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TrainingProgramServiceImpl implements TrainingProgramService {

    private final TrainingProgramRepository trainingProgramRepository;
    private final TrainingProgramMapper trainingProgramMapper;
    private final TrainingEnrollmentRepository trainingEnrollmentRepository;

    @Override
    public TrainingProgramResponse create(CreateTrainingProgramRequest request) {

        if (trainingProgramRepository.existsByTitle(request.getTitle())) {
            throw new DuplicateResourceException(
                    "A training program with this title already exists."
            );
        }

        TrainingProgram program = trainingProgramMapper.toEntity(request);
        program.setStatus(Status.ACTIVE);

        return toEnrichedResponse(trainingProgramRepository.save(program));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingProgramResponse> getAll() {

        return trainingProgramRepository.findAll()
                .stream()
                .map(this::toEnrichedResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingProgramResponse getById(Long id) {

        return toEnrichedResponse(getProgram(id));
    }

    @Override
    public TrainingProgramResponse update(
            Long id,
            UpdateTrainingProgramRequest request
    ) {

        TrainingProgram program = getProgram(id);

        if (!program.getTitle().equals(request.getTitle())
                && trainingProgramRepository.existsByTitle(request.getTitle())) {

            throw new DuplicateResourceException(
                    "A training program with this title already exists."
            );
        }

        trainingProgramMapper.updateEntity(request, program);

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            program.setStatus(parseStatus(request.getStatus()));
        }

        return toEnrichedResponse(trainingProgramRepository.save(program));
    }

    @Override
    public void delete(Long id) {

        TrainingProgram program = getProgram(id);

        if (trainingEnrollmentRepository.existsByTrainingProgramId(id)) {
            throw new BadRequestException(
                    "Cannot delete a training program that already has enrollments."
            );
        }

        trainingProgramRepository.delete(program);
    }

    private TrainingProgramResponse toEnrichedResponse(TrainingProgram program) {

        TrainingProgramResponse response = trainingProgramMapper.toResponse(program);

        var enrollments = trainingEnrollmentRepository.findByTrainingProgramId(program.getId());

        response.setEnrollmentCount(enrollments.size());
        response.setCompletedCount(
                enrollments.stream()
                        .filter(e -> e.getStatus() == TrainingEnrollmentStatus.COMPLETED)
                        .count()
        );

        return response;
    }

    private TrainingProgram getProgram(Long id) {

        return trainingProgramRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Training program not found.")
                );
    }

    private Status parseStatus(String status) {

        try {
            return Status.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
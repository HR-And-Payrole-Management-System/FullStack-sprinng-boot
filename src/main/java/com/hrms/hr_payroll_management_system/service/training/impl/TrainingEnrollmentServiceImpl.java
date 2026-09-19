package com.hrms.hr_payroll_management_system.service.training.impl;

import com.hrms.hr_payroll_management_system.dto.request.training.CreateTrainingEnrollmentRequest;
import com.hrms.hr_payroll_management_system.dto.request.training.UpdateTrainingEnrollmentRequest;
import com.hrms.hr_payroll_management_system.dto.response.training.TrainingEnrollmentResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.training.TrainingEnrollment;
import com.hrms.hr_payroll_management_system.entity.training.TrainingProgram;
import com.hrms.hr_payroll_management_system.enums.TrainingEnrollmentStatus;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.training.TrainingEnrollmentMapper;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.training.TrainingEnrollmentRepository;
import com.hrms.hr_payroll_management_system.repository.training.TrainingProgramRepository;
import com.hrms.hr_payroll_management_system.service.training.TrainingEnrollmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TrainingEnrollmentServiceImpl implements TrainingEnrollmentService {

    private final TrainingEnrollmentRepository trainingEnrollmentRepository;
    private final TrainingEnrollmentMapper trainingEnrollmentMapper;
    private final EmployeeRepository employeeRepository;
    private final TrainingProgramRepository trainingProgramRepository;

    @Override
    public TrainingEnrollmentResponse create(CreateTrainingEnrollmentRequest request) {

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found.")
                );

        TrainingProgram program = trainingProgramRepository.findById(request.getTrainingProgramId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Training program not found.")
                );

        if (trainingEnrollmentRepository.existsByEmployeeIdAndTrainingProgramId(
                employee.getId(), program.getId())) {

            throw new DuplicateResourceException(
                    "This employee is already enrolled in this training program."
            );
        }

        TrainingEnrollment enrollment = TrainingEnrollment.builder()
                .employee(employee)
                .trainingProgram(program)
                .status(TrainingEnrollmentStatus.ENROLLED)
                .enrolledDate(
                        request.getEnrolledDate() != null
                                ? request.getEnrolledDate()
                                : LocalDate.now()
                )
                .build();

        return trainingEnrollmentMapper.toResponse(
                trainingEnrollmentRepository.save(enrollment)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingEnrollmentResponse> getAll() {

        return trainingEnrollmentRepository.findAll()
                .stream()
                .map(trainingEnrollmentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingEnrollmentResponse getById(Long id) {

        return trainingEnrollmentMapper.toResponse(getEnrollment(id));
    }

    @Override
    public TrainingEnrollmentResponse update(
            Long id,
            UpdateTrainingEnrollmentRequest request
    ) {

        TrainingEnrollment enrollment = getEnrollment(id);

        TrainingEnrollmentStatus newStatus = parseStatus(request.getStatus());
        enrollment.setStatus(newStatus);

        if (newStatus == TrainingEnrollmentStatus.COMPLETED) {
            enrollment.setCompletionDate(
                    request.getCompletionDate() != null
                            ? request.getCompletionDate()
                            : LocalDate.now()
            );
        } else {
            enrollment.setCompletionDate(request.getCompletionDate());
        }

        enrollment.setScore(request.getScore());
        enrollment.setCertificateUrl(request.getCertificateUrl());

        return trainingEnrollmentMapper.toResponse(
                trainingEnrollmentRepository.save(enrollment)
        );
    }

    @Override
    public void delete(Long id) {

        trainingEnrollmentRepository.delete(getEnrollment(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingEnrollmentResponse> getByEmployeeId(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found.");
        }

        return trainingEnrollmentRepository.findByEmployeeId(employeeId)
                .stream()
                .map(trainingEnrollmentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingEnrollmentResponse> getByProgramId(Long programId) {

        if (!trainingProgramRepository.existsById(programId)) {
            throw new ResourceNotFoundException("Training program not found.");
        }

        return trainingEnrollmentRepository.findByTrainingProgramId(programId)
                .stream()
                .map(trainingEnrollmentMapper::toResponse)
                .toList();
    }

    private TrainingEnrollment getEnrollment(Long id) {

        return trainingEnrollmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Training enrollment not found.")
                );
    }

    private TrainingEnrollmentStatus parseStatus(String status) {

        try {
            return TrainingEnrollmentStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid enrollment status: " + status);
        }
    }
}
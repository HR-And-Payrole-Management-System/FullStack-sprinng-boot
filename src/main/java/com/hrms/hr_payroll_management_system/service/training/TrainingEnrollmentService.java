package com.hrms.hr_payroll_management_system.service.training;

import com.hrms.hr_payroll_management_system.dto.request.training.CreateTrainingEnrollmentRequest;
import com.hrms.hr_payroll_management_system.dto.request.training.UpdateTrainingEnrollmentRequest;
import com.hrms.hr_payroll_management_system.dto.response.training.TrainingEnrollmentResponse;

import java.util.List;

public interface TrainingEnrollmentService {

    TrainingEnrollmentResponse create(CreateTrainingEnrollmentRequest request);

    List<TrainingEnrollmentResponse> getAll();

    TrainingEnrollmentResponse getById(Long id);

    TrainingEnrollmentResponse update(
            Long id,
            UpdateTrainingEnrollmentRequest request
    );

    void delete(Long id);

    List<TrainingEnrollmentResponse> getByEmployeeId(Long employeeId);

    List<TrainingEnrollmentResponse> getByProgramId(Long programId);
}
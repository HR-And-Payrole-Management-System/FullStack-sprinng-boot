package com.hrms.hr_payroll_management_system.service.training;

import com.hrms.hr_payroll_management_system.dto.request.training.CreateTrainingProgramRequest;
import com.hrms.hr_payroll_management_system.dto.request.training.UpdateTrainingProgramRequest;
import com.hrms.hr_payroll_management_system.dto.response.training.TrainingProgramResponse;

import java.util.List;

public interface TrainingProgramService {

    TrainingProgramResponse create(CreateTrainingProgramRequest request);

    List<TrainingProgramResponse> getAll();

    TrainingProgramResponse getById(Long id);

    TrainingProgramResponse update(
            Long id,
            UpdateTrainingProgramRequest request
    );

    void delete(Long id);
}
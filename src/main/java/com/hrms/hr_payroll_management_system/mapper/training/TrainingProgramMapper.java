package com.hrms.hr_payroll_management_system.mapper.training;

import com.hrms.hr_payroll_management_system.dto.request.training.CreateTrainingProgramRequest;
import com.hrms.hr_payroll_management_system.dto.request.training.UpdateTrainingProgramRequest;
import com.hrms.hr_payroll_management_system.dto.response.training.TrainingProgramResponse;
import com.hrms.hr_payroll_management_system.entity.training.TrainingProgram;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TrainingProgramMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    TrainingProgram toEntity(CreateTrainingProgramRequest request);

    @Mapping(target = "enrollmentCount", ignore = true)
    @Mapping(target = "completedCount", ignore = true)
    TrainingProgramResponse toResponse(TrainingProgram trainingProgram);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntity(
            UpdateTrainingProgramRequest request,
            @MappingTarget TrainingProgram trainingProgram
    );
}
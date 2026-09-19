package com.hrms.hr_payroll_management_system.mapper.training;

import com.hrms.hr_payroll_management_system.dto.response.training.TrainingEnrollmentResponse;
import com.hrms.hr_payroll_management_system.entity.training.TrainingEnrollment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainingEnrollmentMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(
            target = "employeeName",
            expression = "java(enrollment.getEmployee().getFirstName() + \" \" + enrollment.getEmployee().getLastName())"
    )
    @Mapping(target = "trainingProgramId", source = "trainingProgram.id")
    @Mapping(target = "trainingProgramTitle", source = "trainingProgram.title")
    TrainingEnrollmentResponse toResponse(TrainingEnrollment enrollment);
}
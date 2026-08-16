package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.schedule.CreateWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.request.schedule.UpdateWorkScheduleRequest;
import com.hrms.hr_payroll_management_system.dto.response.schedule.WorkScheduleResponse;
import com.hrms.hr_payroll_management_system.entity.WorkSchedule;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface WorkScheduleMapper {

    @Mapping(target = "id", ignore = true)
    WorkSchedule toEntity(
            CreateWorkScheduleRequest request
    );

    WorkScheduleResponse toResponse(
            WorkSchedule workSchedule
    );

    @Mapping(target = "id", ignore = true)
    void updateEntity(
            UpdateWorkScheduleRequest request,
            @MappingTarget WorkSchedule workSchedule
    );
}
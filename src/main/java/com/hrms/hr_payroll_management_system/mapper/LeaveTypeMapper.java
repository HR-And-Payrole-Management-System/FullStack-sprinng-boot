package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.leave.CreateLeaveTypeRequest;
import com.hrms.hr_payroll_management_system.dto.request.leave.UpdateLeaveTypeRequest;
import com.hrms.hr_payroll_management_system.dto.response.leave.LeaveTypeResponse;
import com.hrms.hr_payroll_management_system.entity.LeaveType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LeaveTypeMapper {

    @Mapping(target = "id", ignore = true)
    LeaveType toEntity(CreateLeaveTypeRequest request);

    LeaveTypeResponse toResponse(LeaveType leaveType);

    @Mapping(target = "id", ignore = true)
    void updateEntity(
            UpdateLeaveTypeRequest request,
            @MappingTarget LeaveType leaveType
    );
}
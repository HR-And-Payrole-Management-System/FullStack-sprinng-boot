package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.request.employee.CreateEmployeeRequest;
import com.hrms.hr_payroll_management_system.dto.request.employee.UpdateEmployeeRequest;
import com.hrms.hr_payroll_management_system.dto.response.employee.EmployeeResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    // =========================
    // Create
    // =========================

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "manager", ignore = true)
    Employee toEntity(CreateEmployeeRequest request);


    // =========================
    // Response
    // =========================

    @Mapping(
            target = "companyId",
            source = "company.id"
    )
    @Mapping(
            target = "companyName",
            source = "company.name"
    )
    @Mapping(
            target = "branchId",
            source = "branch.id"
    )
    @Mapping(
            target = "branchName",
            source = "branch.name"
    )
    @Mapping(
            target = "departmentId",
            source = "department.id"
    )
    @Mapping(
            target = "departmentName",
            source = "department.name"
    )
    @Mapping(
            target = "positionId",
            source = "position.id"
    )
    @Mapping(
            target = "positionName",
            source = "position.name"
    )
    @Mapping(
            target = "managerId",
            source = "manager.id"
    )
    @Mapping(
            target = "managerName",
            expression = "java(getManagerName(employee))"
    )
    EmployeeResponse toResponse(Employee employee);


    // =========================
    // Update
    // =========================

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)

    // Set these manually in Service
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "manager", ignore = true)

    void updateEntity(
            UpdateEmployeeRequest request,
            @MappingTarget Employee employee
    );


    // =========================
    // Manager Name
    // =========================

    default String getManagerName(Employee employee) {

        if (employee.getManager() == null) {
            return null;
        }

        String firstName =
                employee.getManager().getFirstName();

        String lastName =
                employee.getManager().getLastName();

        return firstName + " " + lastName;
    }
}
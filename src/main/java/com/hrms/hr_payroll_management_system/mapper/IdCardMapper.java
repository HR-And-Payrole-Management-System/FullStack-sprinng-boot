package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.response.idcard.IdCardResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.IdCard;
import com.hrms.hr_payroll_management_system.entity.Role;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Mapper(componentModel = "spring", imports = {Role.class})
public interface IdCardMapper {

    List<String> ROLE_PRIORITY = List.of("ADMIN", "HR", "EMPLOYEE");
    String DEFAULT_BADGE_COLOR = "#64748B";

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(
            target = "employeeName",
            expression = "java(card.getEmployee().getFirstName() + \" \" + card.getEmployee().getLastName())"
    )
    @Mapping(target = "photoUrl", source = "employee.photoUrl")
    @Mapping(target = "companyName", source = "employee.company.name")
    @Mapping(target = "branchName", source = "employee.branch.name")
    @Mapping(target = "departmentName", source = "employee.department.name")
    @Mapping(target = "positionName", source = "employee.position.name")
    @Mapping(target = "roleName", expression = "java(resolvePriorityRole(card.getEmployee()).map(Role::getName).orElse(null))")
    @Mapping(target = "roleColor", expression = "java(resolvePriorityRole(card.getEmployee()).map(Role::getBadgeColor).orElse(DEFAULT_BADGE_COLOR))")
    IdCardResponse toResponse(IdCard card);

    default Optional<Role> resolvePriorityRole(Employee employee) {
        if (employee.getUser() == null) {
            return Optional.empty();
        }
        Set<Role> roles = employee.getUser().getRoles();
        if (roles == null || roles.isEmpty()) {
            return Optional.empty();
        }
        for (String name : ROLE_PRIORITY) {
            Optional<Role> match = roles.stream()
                    .filter(r -> name.equalsIgnoreCase(r.getName()))
                    .findFirst();
            if (match.isPresent()) {
                return match;
            }
        }
        // Unknown role name not in the priority list — pick deterministically instead of randomly
        return roles.stream().min(Comparator.comparing(Role::getName));
    }
}
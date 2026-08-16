package com.hrms.hr_payroll_management_system.repository.specification;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.EmploymentType;

import org.springframework.data.jpa.domain.Specification;

public final class EmployeeSpecification {

    private EmployeeSpecification() {
    }

    public static Specification<Employee> hasKeyword(String keyword) {

        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String value = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("firstName")),
                            value
                    ),
                    cb.like(
                            cb.lower(root.get("lastName")),
                            value
                    ),
                    cb.like(
                            cb.lower(root.get("employeeCode")),
                            value
                    ),
                    cb.like(
                            cb.lower(root.get("email")),
                            value
                    )
            );
        };
    }

    public static Specification<Employee> hasDepartment(
            Long departmentId
    ) {

        return (root, query, cb) -> {

            if (departmentId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("department").get("id"),
                    departmentId
            );
        };
    }

    public static Specification<Employee> hasPosition(
            Long positionId
    ) {

        return (root, query, cb) -> {

            if (positionId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("position").get("id"),
                    positionId
            );
        };
    }

    public static Specification<Employee> hasEmploymentType(
            EmploymentType employmentType
    ) {

        return (root, query, cb) -> {

            if (employmentType == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("employmentType"),
                    employmentType
            );
        };
    }

    public static Specification<Employee> hasStatus(
            EmployeeStatus status
    ) {

        return (root, query, cb) -> {

            if (status == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("status"),
                    status
            );
        };
    }
}
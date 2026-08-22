package com.hrms.hr_payroll_management_system.repository.specification;

import com.hrms.hr_payroll_management_system.entity.Attendance;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class AttendanceSpecification {

    private AttendanceSpecification() {
    }

    public static Specification<Attendance> employee(
            Long employeeId
    ) {

        return (root, query, cb) ->
                employeeId == null
                        ? cb.conjunction()
                        : cb.equal(
                                root.get("employee").get("id"),
                                employeeId
                        );
    }

    public static Specification<Attendance> department(
            Long departmentId
    ) {

        return (root, query, cb) ->
                departmentId == null
                        ? cb.conjunction()
                        : cb.equal(
                                root.get("employee")
                                        .get("department")
                                        .get("id"),
                                departmentId
                        );
    }

    public static Specification<Attendance> branch(
            Long branchId
    ) {

        return (root, query, cb) ->
                branchId == null
                        ? cb.conjunction()
                        : cb.equal(
                                root.get("employee")
                                        .get("branch")
                                        .get("id"),
                                branchId
                        );
    }

    public static Specification<Attendance> status(
            AttendanceStatus status
    ) {

        return (root, query, cb) ->
                status == null
                        ? cb.conjunction()
                        : cb.equal(
                                root.get("status"),
                                status
                        );
    }

    public static Specification<Attendance> dateRange(
            LocalDate start,
            LocalDate end
    ) {

        return (root, query, cb) -> {

            if (start != null && end != null) {
                return cb.between(
                        root.get("workDate"),
                        start,
                        end
                );
            }

            if (start != null) {
                return cb.greaterThanOrEqualTo(
                        root.get("workDate"),
                        start
                );
            }

            if (end != null) {
                return cb.lessThanOrEqualTo(
                        root.get("workDate"),
                        end
                );
            }

            return cb.conjunction();
        };
    }
}
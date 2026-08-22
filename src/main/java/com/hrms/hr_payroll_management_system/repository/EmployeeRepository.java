package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long>,
        JpaSpecificationExecutor<Employee> {

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmail(String email);

    Optional<Employee> findByEmployeeCode(
            String employeeCode
    );
    boolean existsByCompanyId(Long companyId);

        boolean existsByBranchId(Long branchId);

        boolean existsByDepartmentId(Long departmentId);

        boolean existsByPositionId(Long positionId);

        boolean existsByManagerId(Long managerId);

        long countByPositionId(Long positionId);
         long countByStatus(EmployeeStatus status);
 
    List<Employee> findByDepartmentId(Long departmentId);
}
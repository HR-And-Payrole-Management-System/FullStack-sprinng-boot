package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long>,
        JpaSpecificationExecutor<Employee> {

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmail(String email);

    Optional<Employee> findByEmail(String email);

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
    List<Employee> findByStatus(EmployeeStatus status);

    List<Employee> findByBranchId(Long branchId);
    List<Employee> findByCompanyId(Long companyId);

    Optional<Employee> findByUserId(Long userId);

    // ➕ បន្ថែម (សម្រាប់ trend approximation)
    long countByHireDateLessThanEqual(java.time.LocalDate cutoffDate);
    long countByStatusAndDepartmentId(EmployeeStatus status, Long departmentId);
    long countByDepartmentId(Long departmentId);

    @org.springframework.data.jpa.repository.Query("""
        select e from Employee e
        where e.dateOfBirth is not null
        and month(e.dateOfBirth) = :month
        and e.status = com.hrms.hr_payroll_management_system.enums.EmployeeStatus.ACTIVE
        order by day(e.dateOfBirth) asc
        """)
        List<Employee> findBirthdaysInMonth(@org.springframework.data.repository.query.Param("month") int month);
        // Employees whose user account holds a role with the given
        // permission — used to fan out alerts (e.g. QR check-in) to
        // everyone who can manage attendance, without hardcoding a
        // role name.
        @org.springframework.data.jpa.repository.Query("""
                select distinct e from Employee e
                join e.user u
                join u.roles r
                join r.permissions p
                where p.name = :permissionName
                and e.status = com.hrms.hr_payroll_management_system.enums.EmployeeStatus.ACTIVE
                """)
        List<Employee> findByPermissionName(
                @org.springframework.data.repository.query.Param("permissionName") String permissionName
        );  
        List<Employee> findByCompanyIdAndStatus(Long companyId, EmployeeStatus status);
}
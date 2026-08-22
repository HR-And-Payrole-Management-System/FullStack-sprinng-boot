package com.hrms.hr_payroll_management_system.service.dashboard.impl;

import com.hrms.hr_payroll_management_system.dto.response.dashboard.AttendanceDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.DashboardSummaryResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.EmployeeDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.LeaveDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.OrganizationDashboardResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.PayrollDashboardResponse;
import com.hrms.hr_payroll_management_system.entity.payroll.Payroll;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.enums.LeaveRequestStatus;
import com.hrms.hr_payroll_management_system.enums.PayrollStatus;
import com.hrms.hr_payroll_management_system.repository.AttendanceRepository;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.LeaveRequestRepository;
import com.hrms.hr_payroll_management_system.repository.PositionRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.PayrollRepository;
import com.hrms.hr_payroll_management_system.service.dashboard.DashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final BranchRepository branchRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;

    // =========================================================
    // Step 15-1 : Dashboard Summary
    // =========================================================
    @Override
    public DashboardSummaryResponse getSummary() {

        long totalEmployees = employeeRepository.count();
        long activeEmployees =
                employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
        long inactiveEmployees = totalEmployees - activeEmployees;

        return DashboardSummaryResponse.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .inactiveEmployees(inactiveEmployees)
                .totalCompanies(companyRepository.count())
                .totalBranches(branchRepository.count())
                .totalDepartments(departmentRepository.count())
                .totalPositions(positionRepository.count())
                .build();
    }

    // =========================================================
    // Step 15-2 : Employee Statistics
    // =========================================================
    @Override
    public EmployeeDashboardResponse getEmployeeStats() {

        long total = employeeRepository.count();
        long active =
                employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
        long inactive = total - active;

        return EmployeeDashboardResponse.builder()
                .total(total)
                .active(active)
                .inactive(inactive)
                .build();
    }

    // =========================================================
    // Step 15-3 : Attendance Statistics
    // =========================================================
    @Override
    public AttendanceDashboardResponse getAttendanceStats(LocalDate date) {

        long totalEmployees =
                employeeRepository.countByStatus(EmployeeStatus.ACTIVE);

        long present = attendanceRepository
                .countByWorkDateAndStatus(date, AttendanceStatus.PRESENT);

        long absent = attendanceRepository
                .countByWorkDateAndStatus(date, AttendanceStatus.ABSENT);

        long late = attendanceRepository
                .countByWorkDateAndStatus(date, AttendanceStatus.LATE);

        return AttendanceDashboardResponse.builder()
                .totalEmployees(totalEmployees)
                .present(present)
                .absent(absent)
                .late(late)
                .build();
    }

    // =========================================================
    // Step 15-4 : Leave Statistics
    // =========================================================
    @Override
    public LeaveDashboardResponse getLeaveStats(Integer year) {

        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        long pending = leaveRequestRepository
                .countByStatusAndStartDateBetween(
                        LeaveRequestStatus.PENDING,
                        startOfYear,
                        endOfYear
                );

        long approved = leaveRequestRepository
                .countByStatusAndStartDateBetween(
                        LeaveRequestStatus.APPROVED,
                        startOfYear,
                        endOfYear
                );

        long rejected = leaveRequestRepository
                .countByStatusAndStartDateBetween(
                        LeaveRequestStatus.REJECTED,
                        startOfYear,
                        endOfYear
                );

        long cancelled = leaveRequestRepository
                .countByStatusAndStartDateBetween(
                        LeaveRequestStatus.CANCELLED,
                        startOfYear,
                        endOfYear
                );

        return LeaveDashboardResponse.builder()
                .pending(pending)
                .approved(approved)
                .rejected(rejected)
                .cancelled(cancelled)
                .build();
    }

    // =========================================================
    // Step 15-5 : Payroll Statistics
    // (មិន calculate payroll ថ្មីទេ — អានពី payroll ដែលមានស្រាប់)
    // =========================================================
    @Override
    public PayrollDashboardResponse getPayrollStats(
            Integer year,
            Integer month
    ) {

        List<Payroll> payrolls =
                payrollRepository.findByYearAndMonth(year, month);

        long totalPayroll = payrolls.size();

        long calculated = payrolls.stream()
                .filter(p -> p.getStatus() == PayrollStatus.CALCULATED)
                .count();

        long approved = payrolls.stream()
                .filter(p -> p.getStatus() == PayrollStatus.APPROVED)
                .count();

        long paid = payrolls.stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID)
                .count();

        BigDecimal grossSalary = payrolls.stream()
                .map(Payroll::getGrossSalary)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDeduction = payrolls.stream()
                .map(Payroll::getTotalDeduction)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netSalary = payrolls.stream()
                .map(Payroll::getNetSalary)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return PayrollDashboardResponse.builder()
                .totalPayroll(totalPayroll)
                .calculated(calculated)
                .approved(approved)
                .paid(paid)
                .grossSalary(grossSalary)
                .totalDeduction(totalDeduction)
                .netSalary(netSalary)
                .build();
    }

    // =========================================================
    // Step 15-6 : Organization Statistics
    // =========================================================
    @Override
    public OrganizationDashboardResponse getOrganizationStats() {

        return OrganizationDashboardResponse.builder()
                .companies(companyRepository.count())
                .branches(branchRepository.count())
                .departments(departmentRepository.count())
                .positions(positionRepository.count())
                .build();
    }
}
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
import com.hrms.hr_payroll_management_system.service.holiday.HolidayService;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.PendingApprovalsResponse;
import com.hrms.hr_payroll_management_system.enums.ApplicationStage;
import com.hrms.hr_payroll_management_system.enums.DocumentStatus;
import com.hrms.hr_payroll_management_system.repository.document.EmployeeDocumentRepository;
import com.hrms.hr_payroll_management_system.repository.recruitment.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.RecruitmentPipelineResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.UpcomingBirthdayResponse;
import com.hrms.hr_payroll_management_system.dto.response.holiday.HolidayResponse;
import java.util.List;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.AttendanceTrendPointResponse;
import java.util.stream.Collectors;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.RecentActivityResponse;
import com.hrms.hr_payroll_management_system.entity.audit.AuditLog;
import com.hrms.hr_payroll_management_system.enums.AuditAction;
import com.hrms.hr_payroll_management_system.repository.audit.AuditLogRepository;
import com.hrms.hr_payroll_management_system.enums.TrainingEnrollmentStatus;
import com.hrms.hr_payroll_management_system.repository.training.TrainingEnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hrms.hr_payroll_management_system.dto.response.announcement.AnnouncementResponse;
import com.hrms.hr_payroll_management_system.dto.response.dashboard.ComplianceAlertResponse;
import com.hrms.hr_payroll_management_system.entity.document.EmployeeDocument;
import com.hrms.hr_payroll_management_system.service.AnnouncementService;
import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import java.time.LocalDate;


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
    private final EmployeeDocumentRepository employeeDocumentRepository;
        private final ApplicationRepository applicationRepository;
        private final TrainingEnrollmentRepository trainingEnrollmentRepository;
        private final HolidayService holidayService;
        private final AnnouncementService announcementService;
        private final AuditLogRepository auditLogRepository;
    // =========================================================
    // Step 15-1 : Dashboard Summary
    // =========================================================
    @Override
    public DashboardSummaryResponse getSummary(Long departmentId) {

        long totalEmployees = departmentId != null
                ? employeeRepository.countByDepartmentId(departmentId)
                : employeeRepository.count();

        long activeEmployees = departmentId != null
                ? employeeRepository.countByStatusAndDepartmentId(EmployeeStatus.ACTIVE, departmentId)
                : employeeRepository.countByStatus(EmployeeStatus.ACTIVE);

        long inactiveEmployees = totalEmployees - activeEmployees;

        // ---- Trend (approximate) ----
        // Baseline: headcount as of one year ago, estimated from hireDate.
        // This does NOT account for resignations since then, so it's a
        // best-effort growth indicator, not an exact historical snapshot
        // (no audit/history table exists to compute this precisely).
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);
        long employeesOneYearAgo =
                employeeRepository.countByHireDateLessThanEqual(oneYearAgo);

        Double deltaPercent = null;
        String deltaDirection = null;

        if (employeesOneYearAgo > 0) {
            deltaPercent = Math.round(
                    ((double) (totalEmployees - employeesOneYearAgo) / employeesOneYearAgo) * 1000.0
            ) / 10.0;
            deltaDirection = deltaPercent >= 0 ? "up" : "down";
        }

        return DashboardSummaryResponse.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .inactiveEmployees(inactiveEmployees)
                .totalCompanies(companyRepository.count())
                .totalBranches(branchRepository.count())
                .totalDepartments(departmentRepository.count())
                .totalPositions(positionRepository.count())
                .totalEmployeesDeltaPercent(deltaPercent)
                .totalEmployeesDeltaDirection(deltaDirection)
                .build();
    }

    // =========================================================
    // Step 15-2 : Employee Statistics
    // =========================================================
    @Override
    public EmployeeDashboardResponse getEmployeeStats(Long departmentId) {

        long total = departmentId != null
                ? employeeRepository.countByDepartmentId(departmentId)
                : employeeRepository.count();

        long active = departmentId != null
                ? employeeRepository.countByStatusAndDepartmentId(EmployeeStatus.ACTIVE, departmentId)
                : employeeRepository.countByStatus(EmployeeStatus.ACTIVE);

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
    // =========================================================
// Step 15-7 : Pending Approvals (Phase 2)
// =========================================================
        @Override
        public PendingApprovalsResponse getPendingApprovals() {

        long pendingLeave =
                leaveRequestRepository.countByStatus(LeaveRequestStatus.PENDING);

        long pendingPayroll =
                payrollRepository.countByStatus(PayrollStatus.CALCULATED);

        long pendingDocuments =
                employeeDocumentRepository.countByStatus(DocumentStatus.PENDING);

        long pendingRecruitment =
                applicationRepository.countByStage(ApplicationStage.OFFER);

        return PendingApprovalsResponse.builder()
                .leave(pendingLeave)
                .payroll(pendingPayroll)
                .documents(pendingDocuments)
                .recruitment(pendingRecruitment)
                .build();
        }
        // =========================================================
// Step 15-8 : Recruitment Pipeline (Phase 3)
// =========================================================
@Override
public RecruitmentPipelineResponse getRecruitmentPipeline() {

    // Every application currently sitting at each stage. Note this
    // counts current stage only, not cumulative funnel totals — an
    // application that reached INTERVIEW no longer counts toward
    // APPLIED/SCREENING once it has moved past them.
    long applied = applicationRepository.countByStage(ApplicationStage.APPLIED);
    long screening = applicationRepository.countByStage(ApplicationStage.SCREENING);
    long interview = applicationRepository.countByStage(ApplicationStage.INTERVIEW);
    long offer = applicationRepository.countByStage(ApplicationStage.OFFER);
    long hired = applicationRepository.countByStage(ApplicationStage.HIRED);

    return RecruitmentPipelineResponse.builder()
            .applied(applied)
            .screening(screening)
            .interview(interview)
            .offer(offer)
            .hired(hired)
            .build();
}

// =========================================================
// Step 15-9 : Training Completion % (Phase 3)
// =========================================================
        @Override
        public Integer getTrainingCompletion() {

        long totalEnrollments = trainingEnrollmentRepository.count();

        if (totalEnrollments == 0) {
                return null; // no data yet — frontend shows empty state, not "0%"
        }

        long completed = trainingEnrollmentRepository
                .countByStatus(TrainingEnrollmentStatus.COMPLETED);

        return (int) Math.round((completed * 100.0) / totalEnrollments);
        }

        // =========================================================
// Step 15-10 : Upcoming Holidays (Phase 4)
// =========================================================
        @Override
        public List<HolidayResponse> getUpcomingHolidays(int limit) {

        LocalDate today = LocalDate.now();
        LocalDate lookAhead = today.plusMonths(6); // wide enough window to usually find `limit` holidays

        return holidayService.getByDateRange(today, lookAhead)
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
        }

        // =========================================================
        // Step 15-11 : Birthdays This Month (Phase 4)
        // =========================================================
        @Override
        public List<UpcomingBirthdayResponse> getBirthdaysThisMonth() {

        int currentMonth = LocalDate.now().getMonthValue();

        return employeeRepository.findBirthdaysInMonth(currentMonth)
                .stream()
                .map(e -> UpcomingBirthdayResponse.builder()
                        .employeeId(e.getId())
                        .firstName(e.getFirstName())
                        .lastName(e.getLastName())
                        .photoUrl(e.getPhotoUrl())
                        .dateOfBirth(e.getDateOfBirth())
                        .build())
                .collect(Collectors.toList());
        }
        // =========================================================
// Step 15-12 : Recent Announcements (Phase 5)
// =========================================================
        @Override
        public List<AnnouncementResponse> getRecentAnnouncements(int limit) {
        return announcementService.getRecent(limit);
        }

        // =========================================================
        // Step 15-13 : Compliance Alerts (Phase 5)
        // =========================================================
        @Override
        public List<ComplianceAlertResponse> getComplianceAlerts() {

        LocalDate today = LocalDate.now();
        LocalDate in30Days = today.plusDays(30);

        List<EmployeeDocument> expiringSoon =
                employeeDocumentRepository.findByExpiryDateBetween(today, in30Days);

        return expiringSoon.stream()
                .map(doc -> {
                        long daysLeft = ChronoUnit.DAYS.between(today, doc.getExpiryDate());
                        String employeeName = doc.getEmployee().getFirstName() + " " + doc.getEmployee().getLastName();
                        String docTypeName = doc.getDocumentType().getName();

                        return ComplianceAlertResponse.builder()
                                .label(employeeName + " — " + docTypeName)
                                .daysLeft(daysLeft)
                                .build();
                })
                .sorted((a, b) -> Long.compare(a.getDaysLeft(), b.getDaysLeft()))
                .collect(Collectors.toList());
        }
        // =========================================================
        // Step 15-14 : Recent Activity (Phase 6)
        // =========================================================
        @Override
        public List<RecentActivityResponse> getRecentActivity(int limit) {

        return auditLogRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(limit)
                .map(this::toRecentActivity)
                .collect(Collectors.toList());
        }

        private RecentActivityResponse toRecentActivity(AuditLog log) {

        String actionLabel = switch (log.getAction()) {
                case CREATE -> "created";
                case UPDATE -> "updated";
                case DELETE -> "deleted";
                case APPROVE -> "approved";
                case REJECT -> "rejected";
                case VERIFY -> "verified";
                case PROCESS -> "processed";
                case LOGIN_SUCCESS -> "logged in";
                case LOGIN_FAILED -> "failed to log in as";
        };

        String icon = switch (log.getAction()) {
                case CREATE -> "➕";
                case UPDATE -> "✏️";
                case DELETE -> "🗑️";
                case APPROVE -> "✅";
                case REJECT -> "❌";
                case VERIFY -> "🔎";
                case PROCESS -> "⚙️";
                case LOGIN_SUCCESS -> "🔑";
                case LOGIN_FAILED -> "⚠️";
        };

        String target = log.getEntityId() != null
                ? log.getEntityType() + " #" + log.getEntityId()
                : log.getEntityType();

        return RecentActivityResponse.builder()
                .actor(log.getActor())
                .action(actionLabel)
                .target(target)
                .timestamp(log.getCreatedAt())
                .icon(icon)
                .build();
        }
        @Override
        @Transactional(readOnly = true)
        public List<AttendanceTrendPointResponse> getAttendanceTrend(int days) {

        List<AttendanceTrendPointResponse> trend = new java.util.ArrayList<>();
        LocalDate today = LocalDate.now();

        // Oldest → newest, so the chart reads left-to-right chronologically
        for (int i = days - 1; i >= 0; i--) {
                LocalDate date = today.minusDays(i);

                long present = attendanceRepository
                        .countByWorkDateAndStatus(date, AttendanceStatus.PRESENT);
                long absent = attendanceRepository
                        .countByWorkDateAndStatus(date, AttendanceStatus.ABSENT);
                long late = attendanceRepository
                        .countByWorkDateAndStatus(date, AttendanceStatus.LATE);

                trend.add(
                        AttendanceTrendPointResponse.builder()
                                .date(date)
                                .present(present)
                                .absent(absent)
                                .late(late)
                                .build()
                );
        }

        return trend;
        }
}
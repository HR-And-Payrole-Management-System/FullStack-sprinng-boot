package com.hrms.hr_payroll_management_system.service.analytics.impl;

import com.hrms.hr_payroll_management_system.dto.response.analytics.AnalyticsPointResponse;
import com.hrms.hr_payroll_management_system.dto.response.analytics.AttendanceTrendPointResponse;
import com.hrms.hr_payroll_management_system.entity.Attendance;
import com.hrms.hr_payroll_management_system.entity.LeaveRequest;
import com.hrms.hr_payroll_management_system.entity.payroll.Payroll;
import com.hrms.hr_payroll_management_system.entity.recruitment.Application;
import com.hrms.hr_payroll_management_system.enums.AttendanceStatus;
import com.hrms.hr_payroll_management_system.enums.LeaveRequestStatus;
import com.hrms.hr_payroll_management_system.repository.AttendanceRepository;
import com.hrms.hr_payroll_management_system.repository.LeaveRequestRepository;
import com.hrms.hr_payroll_management_system.repository.payroll.PayrollRepository;
import com.hrms.hr_payroll_management_system.repository.recruitment.ApplicationRepository;
import com.hrms.hr_payroll_management_system.service.analytics.AnalyticsService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final PayrollRepository payrollRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final AttendanceRepository attendanceRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    public List<AnalyticsPointResponse> getPayrollCostTrend(int months) {

        int span = months > 0 ? months : 6;
        List<Payroll> payrolls = payrollRepository.findAll();
        LocalDate now = LocalDate.now();

        List<AnalyticsPointResponse> trend = new ArrayList<>();

        for (int i = span - 1; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            int year = monthDate.getYear();
            int month = monthDate.getMonthValue();

            double total = payrolls.stream()
                    .filter(p -> p.getYear() != null && p.getYear() == year
                            && p.getMonth() != null && p.getMonth() == month)
                    .map(Payroll::getNetSalary)
                    .filter(Objects::nonNull)
                    .mapToDouble(BigDecimal::doubleValue)
                    .sum();

            String label = monthDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                    + " " + String.valueOf(year).substring(2);

            trend.add(AnalyticsPointResponse.builder().name(label).value(total).build());
        }

        return trend;
    }

    @Override
    public List<AnalyticsPointResponse> getPayrollCostByDepartment() {

        int currentYear = LocalDate.now().getYear();

        List<Payroll> payrolls = payrollRepository.findAll()
                .stream()
                .filter(p -> p.getYear() != null && p.getYear() == currentYear)
                .toList();

        Map<String, Double> byDepartment = new LinkedHashMap<>();

        for (Payroll p : payrolls) {
            if (p.getEmployee() == null || p.getEmployee().getDepartment() == null
                    || p.getNetSalary() == null) {
                continue;
            }

            String deptName = p.getEmployee().getDepartment().getName();
            byDepartment.merge(deptName, p.getNetSalary().doubleValue(), Double::sum);
        }

        return byDepartment.entrySet().stream()
                .map(e -> AnalyticsPointResponse.builder().name(e.getKey()).value(e.getValue()).build())
                .toList();
    }

    @Override
    public List<AnalyticsPointResponse> getLeaveUtilizationByType() {

        List<LeaveRequest> approved = leaveRequestRepository.findAll()
                .stream()
                .filter(r -> r.getStatus() == LeaveRequestStatus.APPROVED)
                .toList();

        Map<String, Double> byType = new LinkedHashMap<>();

        for (LeaveRequest r : approved) {
            if (r.getLeaveType() == null || r.getTotalDays() == null) {
                continue;
            }
            byType.merge(r.getLeaveType().getName(), r.getTotalDays(), Double::sum);
        }

        return byType.entrySet().stream()
                .map(e -> AnalyticsPointResponse.builder().name(e.getKey()).value(e.getValue()).build())
                .toList();
    }

    @Override
    public List<AnalyticsPointResponse> getLeaveUtilizationByDepartment() {

        List<LeaveRequest> approved = leaveRequestRepository.findAll()
                .stream()
                .filter(r -> r.getStatus() == LeaveRequestStatus.APPROVED)
                .toList();

        Map<String, Double> byDepartment = new LinkedHashMap<>();

        for (LeaveRequest r : approved) {
            if (r.getEmployee() == null || r.getEmployee().getDepartment() == null
                    || r.getTotalDays() == null) {
                continue;
            }
            String deptName = r.getEmployee().getDepartment().getName();
            byDepartment.merge(deptName, r.getTotalDays(), Double::sum);
        }

        return byDepartment.entrySet().stream()
                .map(e -> AnalyticsPointResponse.builder().name(e.getKey()).value(e.getValue()).build())
                .toList();
    }

    @Override
    public List<AttendanceTrendPointResponse> getAttendanceTrend(int days) {

        int span = days > 0 ? days : 14;
        List<Attendance> attendance = attendanceRepository.findAll();
        LocalDate today = LocalDate.now();

        List<AttendanceTrendPointResponse> trend = new ArrayList<>();

        for (int i = span - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);

            List<Attendance> dayRecords = attendance.stream()
                    .filter(a -> date.equals(a.getWorkDate()))
                    .toList();

            long present = dayRecords.stream()
                    .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                    .count();
            long absent = dayRecords.stream()
                    .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
                    .count();
            long late = dayRecords.stream()
                    .filter(a -> a.getStatus() == AttendanceStatus.LATE)
                    .count();

            trend.add(
                    AttendanceTrendPointResponse.builder()
                            .date(date.toString())
                            .present(present)
                            .absent(absent)
                            .late(late)
                            .build()
            );
        }

        return trend;
    }

    @Override
    public List<AnalyticsPointResponse> getRecruitmentFunnel() {

        List<Application> applications = applicationRepository.findAll();

        Map<String, Long> byStage = applications.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStage().name(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        return byStage.entrySet().stream()
                .map(e -> AnalyticsPointResponse.builder().name(e.getKey()).value(e.getValue()).build())
                .toList();
    }
}
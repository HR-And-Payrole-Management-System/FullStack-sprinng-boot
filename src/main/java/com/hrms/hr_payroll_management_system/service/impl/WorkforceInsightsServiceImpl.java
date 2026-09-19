package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.response.workforce.ChartPointResponse;
import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.service.WorkforceInsightsService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkforceInsightsServiceImpl implements WorkforceInsightsService {

    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ChartPointResponse> getEmployeeTrend() {
        List<Employee> employees = employeeRepository.findAll();

        LocalDate now = LocalDate.now();
        List<ChartPointResponse> trend = new ArrayList<>();

        // Trailing 12 months, cumulative headcount as of the end of each month
        for (int i = 11; i >= 0; i--) {
            LocalDate monthEnd = now.minusMonths(i).withDayOfMonth(1).plusMonths(1).minusDays(1);
            long count = employees.stream()
                    .filter(e -> e.getHireDate() != null && !e.getHireDate().isAfter(monthEnd))
                    .count();

            String label = monthEnd.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                    + " " + String.valueOf(monthEnd.getYear()).substring(2);

            trend.add(ChartPointResponse.builder().name(label).value(count).build());
        }

        return trend;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChartPointResponse> getAttritionByDepartment() {
        return groupCount(
                employeeRepository.findByStatus(EmployeeStatus.RESIGNED),
                e -> e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChartPointResponse> getAttritionByPosition() {
        return groupCount(
                employeeRepository.findByStatus(EmployeeStatus.RESIGNED),
                e -> e.getPosition() != null ? e.getPosition().getName() : "Unassigned"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChartPointResponse> getAgeGroups() {
        List<Employee> employees = employeeRepository.findAll();
        LocalDate today = LocalDate.now();

        Map<String, Long> buckets = new LinkedHashMap<>();
        buckets.put("18 - 25", 0L);
        buckets.put("26 - 35", 0L);
        buckets.put("36 - 45", 0L);
        buckets.put("46 - 55", 0L);
        buckets.put("55+", 0L);

        for (Employee e : employees) {
            if (e.getDateOfBirth() == null) continue;
            int age = Period.between(e.getDateOfBirth(), today).getYears();
            String bucket = age <= 25 ? "18 - 25"
                    : age <= 35 ? "26 - 35"
                    : age <= 45 ? "36 - 45"
                    : age <= 55 ? "46 - 55"
                    : "55+";
            buckets.merge(bucket, 1L, Long::sum);
        }

        return toChartPoints(buckets);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChartPointResponse> getGenderDiversity() {
        return groupCount(
                employeeRepository.findAll(),
                e -> e.getGender() != null ? e.getGender() : "Not Specified"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChartPointResponse> getTenureDistribution() {
        List<Employee> employees = employeeRepository.findAll();
        LocalDate today = LocalDate.now();

        Map<String, Long> buckets = new LinkedHashMap<>();
        buckets.put("< 1 year", 0L);
        buckets.put("1 - 3 years", 0L);
        buckets.put("4 - 7 years", 0L);
        buckets.put("8 - 10 years", 0L);
        buckets.put("10+ years", 0L);

        for (Employee e : employees) {
            if (e.getHireDate() == null) continue;
            int years = Period.between(e.getHireDate(), today).getYears();
            String bucket = years < 1 ? "< 1 year"
                    : years <= 3 ? "1 - 3 years"
                    : years <= 7 ? "4 - 7 years"
                    : years <= 10 ? "8 - 10 years"
                    : "10+ years";
            buckets.merge(bucket, 1L, Long::sum);
        }

        return toChartPoints(buckets);
    }

    // ---- helpers ----

    private List<ChartPointResponse> groupCount(List<Employee> list, java.util.function.Function<Employee, String> keyFn) {
        Map<String, Long> counts = list.stream()
                .collect(Collectors.groupingBy(keyFn, LinkedHashMap::new, Collectors.counting()));
        return toChartPoints(counts);
    }

    private List<ChartPointResponse> toChartPoints(Map<String, Long> map) {
        return map.entrySet().stream()
                .map(en -> ChartPointResponse.builder().name(en.getKey()).value(en.getValue()).build())
                .collect(Collectors.toList());
    }
}
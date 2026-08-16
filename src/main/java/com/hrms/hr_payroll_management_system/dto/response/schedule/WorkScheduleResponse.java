package com.hrms.hr_payroll_management_system.dto.response.schedule;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Data
public class WorkScheduleResponse {

    private Long id;

    private String name;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer breakMinutes;

    private Set<DayOfWeek> workingDays;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
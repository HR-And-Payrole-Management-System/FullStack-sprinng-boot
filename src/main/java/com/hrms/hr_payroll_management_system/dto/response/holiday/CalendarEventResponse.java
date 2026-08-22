package com.hrms.hr_payroll_management_system.dto.response.holiday;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CalendarEventResponse {

    private Long id;

    private LocalDate date;

    private String title;

    private String eventType;

    private Boolean paidHoliday;

    private Long companyId;

    private Long branchId;
}
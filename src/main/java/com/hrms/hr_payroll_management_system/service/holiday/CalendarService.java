package com.hrms.hr_payroll_management_system.service.holiday;

import com.hrms.hr_payroll_management_system.dto.response.holiday.CalendarEventResponse;

import java.util.List;

public interface CalendarService {

    List<CalendarEventResponse> getCalendar(
            int year,
            int month
    );
}
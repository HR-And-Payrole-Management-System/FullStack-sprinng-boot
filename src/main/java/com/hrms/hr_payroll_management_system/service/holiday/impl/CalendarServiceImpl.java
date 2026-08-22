package com.hrms.hr_payroll_management_system.service.holiday.impl;

import com.hrms.hr_payroll_management_system.dto.response.holiday.CalendarEventResponse;
import com.hrms.hr_payroll_management_system.entity.Holiday;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.repository.HolidayRepository;
import com.hrms.hr_payroll_management_system.service.holiday.CalendarService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarServiceImpl
        implements CalendarService {

    private final HolidayRepository holidayRepository;

    @Override
    public List<CalendarEventResponse> getCalendar(
            int year,
            int month
    ) {

        if (month < 1 || month > 12) {
            throw new BadRequestException(
                    "Month must be between 1 and 12."
            );
        }

        LocalDate start =
                LocalDate.of(
                        year,
                        month,
                        1
                );

        LocalDate end =
                start.withDayOfMonth(
                        start.lengthOfMonth()
                );

        return holidayRepository
                .findByHolidayDateBetweenAndActiveTrueOrderByHolidayDateAsc(
                        start,
                        end
                )
                .stream()
                .map(this::map)
                .toList();
    }

    private CalendarEventResponse map(
            Holiday holiday
    ) {

        return CalendarEventResponse.builder()
                .id(holiday.getId())
                .date(
                        holiday.getHolidayDate()
                )
                .title(
                        holiday.getName()
                )
                .eventType(
                        holiday.getType().name()
                )
                .paidHoliday(
                        holiday.getPaidHoliday()
                )
                .companyId(
                        holiday.getCompany() == null
                                ? null
                                : holiday.getCompany().getId()
                )
                .branchId(
                        holiday.getBranch() == null
                                ? null
                                : holiday.getBranch().getId()
                )
                .build();
    }
}
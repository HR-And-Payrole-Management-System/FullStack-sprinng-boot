package com.hrms.hr_payroll_management_system.controller.holiday;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.response.holiday.CalendarEventResponse;
import com.hrms.hr_payroll_management_system.service.holiday.CalendarService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping
    @PreAuthorize(
            "hasRole('ADMIN') or hasAuthority('HOLIDAY_VIEW')"
    )
    public ResponseEntity<
            ApiResponse<List<CalendarEventResponse>>
            > getCalendar(
            @RequestParam int year,
            @RequestParam int month
    ) {

        return ResponseEntity.ok(
                ApiResponse
                        .<List<CalendarEventResponse>>builder()
                        .success(true)
                        .message(
                                "Calendar retrieved successfully."
                        )
                        .data(
                                calendarService.getCalendar(
                                        year,
                                        month
                                )
                        )
                        .build()
        );
    }
}
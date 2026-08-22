package com.hrms.hr_payroll_management_system.service.holiday;

import com.hrms.hr_payroll_management_system.dto.request.holiday.CreateHolidayRequest;
import com.hrms.hr_payroll_management_system.dto.request.holiday.UpdateHolidayRequest;
import com.hrms.hr_payroll_management_system.dto.response.holiday.HolidayResponse;

import java.time.LocalDate;
import java.util.List;

public interface HolidayService {

    HolidayResponse create(
            CreateHolidayRequest request
    );

    HolidayResponse getById(Long id);

    List<HolidayResponse> getAll();

    List<HolidayResponse> getByDateRange(
            LocalDate startDate,
            LocalDate endDate
    );

    HolidayResponse update(
            Long id,
            UpdateHolidayRequest request
    );

    void delete(Long id);

    boolean isHoliday(LocalDate date);
}
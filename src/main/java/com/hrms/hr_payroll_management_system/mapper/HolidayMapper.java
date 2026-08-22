package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.response.holiday.HolidayResponse;
import com.hrms.hr_payroll_management_system.entity.Holiday;
import org.springframework.stereotype.Component;

@Component
public class HolidayMapper {

    public HolidayResponse toResponse(
            Holiday holiday
    ) {

        return HolidayResponse.builder()
                .id(holiday.getId())
                .name(holiday.getName())
                .holidayDate(
                        holiday.getHolidayDate()
                )
                .type(
                        holiday.getType().name()
                )

                .companyId(
                        holiday.getCompany() == null
                                ? null
                                : holiday.getCompany().getId()
                )

                .companyName(
                        holiday.getCompany() == null
                                ? null
                                : holiday.getCompany().getName()
                )

                .branchId(
                        holiday.getBranch() == null
                                ? null
                                : holiday.getBranch().getId()
                )

                .branchName(
                        holiday.getBranch() == null
                                ? null
                                : holiday.getBranch().getName()
                )

                .description(
                        holiday.getDescription()
                )

                .paidHoliday(
                        holiday.getPaidHoliday()
                )

                .active(
                        holiday.getActive()
                )

                .build();
    }
}
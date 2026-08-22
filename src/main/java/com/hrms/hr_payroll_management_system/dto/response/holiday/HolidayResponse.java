package com.hrms.hr_payroll_management_system.dto.response.holiday;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class HolidayResponse {

    private Long id;

    private String name;

    private LocalDate holidayDate;

    private String type;

    private Long companyId;
    private String companyName;

    private Long branchId;
    private String branchName;

    private String description;

    private Boolean paidHoliday;

    private Boolean active;
}
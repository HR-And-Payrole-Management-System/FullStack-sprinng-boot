package com.hrms.hr_payroll_management_system.dto.request.holiday;

import com.hrms.hr_payroll_management_system.enums.HolidayType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateHolidayRequest {

    @NotBlank(message = "Holiday name is required")
    @Size(max = 150)
    private String name;

    @NotNull(message = "Holiday date is required")
    private LocalDate holidayDate;

    @NotNull(message = "Holiday type is required")
    private HolidayType type;

    private Long companyId;

    private Long branchId;

    @Size(max = 500)
    private String description;

    @NotNull
    private Boolean paidHoliday;
}
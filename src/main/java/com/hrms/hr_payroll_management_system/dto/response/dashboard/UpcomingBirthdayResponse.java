package com.hrms.hr_payroll_management_system.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingBirthdayResponse {

    private Long employeeId;
    private String firstName;
    private String lastName;
    private String photoUrl;
    private LocalDate dateOfBirth;
}
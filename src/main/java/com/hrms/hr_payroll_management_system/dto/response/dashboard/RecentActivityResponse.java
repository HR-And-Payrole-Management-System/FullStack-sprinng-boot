package com.hrms.hr_payroll_management_system.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityResponse {

    private String actor;
    private String action;    // human-readable: "created", "updated", "deleted", etc.
    private String target;    // e.g. "Employee #42" or the description text
    private LocalDateTime timestamp;
    private String icon;      // small emoji matching the action type
}
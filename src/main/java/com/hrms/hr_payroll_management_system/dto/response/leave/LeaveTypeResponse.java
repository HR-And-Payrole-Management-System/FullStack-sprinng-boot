package com.hrms.hr_payroll_management_system.dto.response.leave;

import lombok.Data;

@Data
public class LeaveTypeResponse {

    private Long id;
    private String name;
    private String description;
    private Integer defaultDays;
    private Boolean paidLeave;
    private String status;
}   
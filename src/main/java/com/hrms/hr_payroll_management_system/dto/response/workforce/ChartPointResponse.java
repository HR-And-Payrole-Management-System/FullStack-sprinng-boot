package com.hrms.hr_payroll_management_system.dto.response.workforce;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartPointResponse {
    private String name;
    private long value;
}
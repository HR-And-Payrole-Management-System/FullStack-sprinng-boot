package com.hrms.hr_payroll_management_system.dto.response.okr;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeyResultResponse {
    private Long id;
    private String title;
    private String metricType;
    private BigDecimal startValue;
    private BigDecimal targetValue;
    private BigDecimal currentValue;
    private String unit;
    private int progressPercent; // computed, never stored
}
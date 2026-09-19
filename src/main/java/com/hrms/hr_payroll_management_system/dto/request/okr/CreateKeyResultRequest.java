package com.hrms.hr_payroll_management_system.dto.request.okr;

import com.hrms.hr_payroll_management_system.enums.KeyResultMetricType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateKeyResultRequest {

    @NotBlank
    private String title;

    @NotNull
    private KeyResultMetricType metricType;

    @NotNull
    private BigDecimal startValue;

    @NotNull
    private BigDecimal targetValue;

    private String unit;
}
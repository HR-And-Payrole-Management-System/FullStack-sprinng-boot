package com.hrms.hr_payroll_management_system.dto.request.okr;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateKeyResultProgressRequest {

    @NotNull
    private BigDecimal currentValue;
}
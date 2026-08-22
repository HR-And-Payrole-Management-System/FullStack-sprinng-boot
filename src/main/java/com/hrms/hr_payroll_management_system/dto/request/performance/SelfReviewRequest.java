package com.hrms.hr_payroll_management_system.dto.request.performance;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SelfReviewRequest {

    @NotNull
    @DecimalMin("1.00")
    @DecimalMax("5.00")
    private BigDecimal rating;

    @Size(max = 2000)
    private String comment;
}
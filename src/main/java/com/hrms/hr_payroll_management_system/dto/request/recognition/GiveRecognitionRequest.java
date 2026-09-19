package com.hrms.hr_payroll_management_system.dto.request.recognition;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GiveRecognitionRequest {

    @NotNull
    private Long giverId;

    @NotNull
    private Long receiverId;

    private Long coreValueId;

    @NotBlank
    @Size(max = 500)
    private String message;

    @NotNull
    @Min(1)
    @Max(50)
    private Integer points;
}
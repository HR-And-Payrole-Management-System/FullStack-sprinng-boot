package com.hrms.hr_payroll_management_system.dto.request.leave;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewLeaveRequest {
    @Size(max = 500)
    private String comment;
}

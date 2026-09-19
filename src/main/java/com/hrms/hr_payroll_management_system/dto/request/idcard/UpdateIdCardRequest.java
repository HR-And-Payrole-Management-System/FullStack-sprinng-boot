package com.hrms.hr_payroll_management_system.dto.request.idcard;

import com.hrms.hr_payroll_management_system.enums.IdCardAccessLevel;
import com.hrms.hr_payroll_management_system.enums.IdCardStatus;

import lombok.Data;

@Data
public class UpdateIdCardRequest {

    // All optional — only the fields provided (non-null) are applied.
    private IdCardStatus status;

    private IdCardAccessLevel accessLevel;

    private String cardNumber;

    private String note;
}
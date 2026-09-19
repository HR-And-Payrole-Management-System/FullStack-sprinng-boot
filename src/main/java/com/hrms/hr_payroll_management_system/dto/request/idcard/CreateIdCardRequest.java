package com.hrms.hr_payroll_management_system.dto.request.idcard;

import com.hrms.hr_payroll_management_system.enums.IdCardAccessLevel;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateIdCardRequest {

    private String cardNumber;

    private IdCardAccessLevel accessLevel;

    private LocalDate issuedDate;

    private String note;
}
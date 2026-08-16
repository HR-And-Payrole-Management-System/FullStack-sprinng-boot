package com.hrms.hr_payroll_management_system.dto.response.employee;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmergencyContactResponse {

    private Long id;

    private String contactName;

    private String relationship;

    private String phone;

    private String email;

    private String address;
}

package com.hrms.hr_payroll_management_system.dto.response.location;

import lombok.Data;

@Data
public class LocationResponse {

    private Long id;

    private String name;

    private Long branchId;

    private String branchName;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    private String postalCode;

    private Double latitude;

    private Double longitude;

    private Boolean primary;

    private String status;
}
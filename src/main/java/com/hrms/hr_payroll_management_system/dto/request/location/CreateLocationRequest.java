package com.hrms.hr_payroll_management_system.dto.request.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateLocationRequest {

    @NotBlank(message = "Location name is required")
    @Size(max = 150)
    private String name;

    @NotNull(message = "Branch is required")
    private Long branchId;

    @NotBlank(message = "Address line 1 is required")
    @Size(max = 255)
    private String addressLine1;

    @Size(max = 255)
    private String addressLine2;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String state;

    @NotBlank(message = "Country is required")
    @Size(max = 100)
    private String country;

    @Size(max = 20)
    private String postalCode;

    private Double latitude;

    private Double longitude;

    private Boolean primary;
}
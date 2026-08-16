package com.hrms.hr_payroll_management_system.dto.response.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrentUserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String status;

    private Boolean emailVerified;

    private Boolean accountLocked;

    private Boolean enabled;

    private Set<String> roles;

    private Set<String> permissions;
}
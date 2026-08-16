package com.hrms.hr_payroll_management_system.dto.response.user;

import com.hrms.hr_payroll_management_system.dto.response.role.RoleResponse;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String status;

    private Boolean emailVerified;

    private Boolean accountLocked;

    private Boolean enabled;

    private Set<RoleResponse> roles;
    private Integer failedLoginAttempts;

    private LocalDateTime lockedAt;
}
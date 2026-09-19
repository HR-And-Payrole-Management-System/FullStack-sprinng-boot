package com.hrms.hr_payroll_management_system.dto.response.setting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingResponse {

    private Long id;
    private String settingKey;
    private String settingValue;
    private String category;
    private String dataType;
    private String description;
}
package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.response.setting.SystemSettingResponse;
import com.hrms.hr_payroll_management_system.entity.SystemSetting;

import org.springframework.stereotype.Component;

@Component
public class SystemSettingMapper {

    public SystemSettingResponse toResponse(SystemSetting setting) {
        return SystemSettingResponse.builder()
                .id(setting.getId())
                .settingKey(setting.getSettingKey())
                .settingValue(setting.getSettingValue())
                .category(setting.getCategory())
                .dataType(setting.getDataType())
                .description(setting.getDescription())
                .build();
    }
}
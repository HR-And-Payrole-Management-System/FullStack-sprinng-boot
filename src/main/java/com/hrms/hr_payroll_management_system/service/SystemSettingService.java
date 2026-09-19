package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.setting.UpdateSettingValueRequest;
import com.hrms.hr_payroll_management_system.dto.request.setting.UpsertSettingRequest;
import com.hrms.hr_payroll_management_system.dto.response.setting.SystemSettingResponse;

import java.util.List;

public interface SystemSettingService {

    List<SystemSettingResponse> getAll();

    List<SystemSettingResponse> getByCategory(String category);

    SystemSettingResponse getByKey(String key);

    SystemSettingResponse upsert(UpsertSettingRequest request);

    SystemSettingResponse updateValue(String key, UpdateSettingValueRequest request);

    void delete(String key);
}
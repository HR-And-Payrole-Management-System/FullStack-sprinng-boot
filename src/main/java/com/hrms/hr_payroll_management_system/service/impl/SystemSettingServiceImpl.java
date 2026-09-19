package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.setting.UpdateSettingValueRequest;
import com.hrms.hr_payroll_management_system.dto.request.setting.UpsertSettingRequest;
import com.hrms.hr_payroll_management_system.dto.response.setting.SystemSettingResponse;
import com.hrms.hr_payroll_management_system.entity.SystemSetting;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.SystemSettingMapper;
import com.hrms.hr_payroll_management_system.repository.SystemSettingRepository;
import com.hrms.hr_payroll_management_system.service.SystemSettingService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;
    private final SystemSettingMapper systemSettingMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SystemSettingResponse> getAll() {
        return systemSettingRepository.findAll()
                .stream()
                .map(systemSettingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemSettingResponse> getByCategory(String category) {
        return systemSettingRepository.findByCategory(category)
                .stream()
                .map(systemSettingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SystemSettingResponse getByKey(String key) {
        SystemSetting setting = findByKeyOrThrow(key);
        return systemSettingMapper.toResponse(setting);
    }

    @Override
    public SystemSettingResponse upsert(UpsertSettingRequest request) {
        SystemSetting setting = systemSettingRepository
                .findBySettingKey(request.getSettingKey())
                .orElseGet(SystemSetting::new);

        setting.setSettingKey(request.getSettingKey());
        setting.setSettingValue(request.getSettingValue());
        setting.setCategory(request.getCategory());
        setting.setDataType(request.getDataType());
        setting.setDescription(request.getDescription());

        SystemSetting saved = systemSettingRepository.save(setting);
        return systemSettingMapper.toResponse(saved);
    }

    @Override
    public SystemSettingResponse updateValue(String key, UpdateSettingValueRequest request) {
        SystemSetting setting = findByKeyOrThrow(key);
        setting.setSettingValue(request.getSettingValue());

        SystemSetting saved = systemSettingRepository.save(setting);
        return systemSettingMapper.toResponse(saved);
    }

    @Override
    public void delete(String key) {
        if (!systemSettingRepository.existsBySettingKey(key)) {
            throw new ResourceNotFoundException("Setting not found: " + key);
        }
        systemSettingRepository.deleteBySettingKey(key);
    }

    private SystemSetting findByKeyOrThrow(String key) {
        return systemSettingRepository.findBySettingKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found: " + key));
    }
}
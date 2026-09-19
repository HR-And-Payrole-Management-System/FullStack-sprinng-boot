package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.SystemSetting;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {

    Optional<SystemSetting> findBySettingKey(String settingKey);

    List<SystemSetting> findByCategory(String category);

    boolean existsBySettingKey(String settingKey);

    void deleteBySettingKey(String settingKey);
}
package com.hrms.hr_payroll_management_system.repository;

import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.entity.UserDevice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDeviceRepository
        extends JpaRepository<UserDevice, Long> {

    Optional<UserDevice> findByUserAndDeviceId(User user, String deviceId);

    List<UserDevice> findByUser(User user);
}
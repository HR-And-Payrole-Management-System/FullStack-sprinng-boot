package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.entity.UserDevice;
import jakarta.servlet.http.HttpServletRequest;

public interface DeviceSessionService {

    // ចាប់ deviceId ពី header X-Device-Id, ផ្គូផ្គងជាមួយកំណត់ត្រាដែលមានស្រាប់
    // (update lastLoginAt) ឬបង្កើតថ្មីជា untrusted device
    UserDevice identifyDevice(User user, HttpServletRequest request);
}
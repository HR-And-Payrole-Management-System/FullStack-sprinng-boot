package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.entity.UserDevice;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.repository.UserDeviceRepository;
import com.hrms.hr_payroll_management_system.service.DeviceSessionService;
import com.hrms.hr_payroll_management_system.service.MailService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class DeviceSessionServiceImpl implements DeviceSessionService {

    private final UserDeviceRepository userDeviceRepository;
    private final MailService mailService;

    private static final String DEVICE_ID_HEADER = "X-Device-Id";

    @Override
    public UserDevice identifyDevice(
            User user,
            HttpServletRequest request
    ) {

        String deviceId = request.getHeader(DEVICE_ID_HEADER);

        if (deviceId == null || deviceId.isBlank()) {
            throw new BadRequestException(
                    "Missing device identifier."
            );
        }

        String userAgent = request.getHeader("User-Agent");
        String ipAddress = getClientIp(request);

        return userDeviceRepository
                .findByUserAndDeviceId(user, deviceId)
                .map(existing -> {

                    existing.setLastLoginAt(LocalDateTime.now());
                    existing.setIpAddress(ipAddress);
                    existing.setUserAgent(userAgent);

                    return userDeviceRepository.save(existing);
                })
                .orElseGet(() ->
                        registerNewDevice(
                                user,
                                deviceId,
                                userAgent,
                                ipAddress
                        )
                );
    }

    private UserDevice registerNewDevice(
            User user,
            String deviceId,
            String userAgent,
            String ipAddress
    ) {

        UserDevice device = UserDevice.builder()
                .deviceId(deviceId)
                .deviceName(userAgent)
                .userAgent(userAgent)
                .ipAddress(ipAddress)
                .trusted(false)
                .lastLoginAt(LocalDateTime.now())
                .user(user)
                .build();

        UserDevice saved = userDeviceRepository.save(device);

        // ជូនដំណឹងតែប៉ុណ្ណោះ — មិន block login ព្រោះ OTP បានផ្ទៀងផ្ទាត់រួចហើយ
        mailService.sendNewDeviceAlert(
                user.getEmail(),
                ipAddress,
                userAgent
        );

        return saved;
    }

    private String getClientIp(HttpServletRequest request) {

        String forwarded = request.getHeader("X-Forwarded-For");

        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}
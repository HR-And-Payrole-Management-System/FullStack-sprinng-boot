package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.announcement.CreateAnnouncementRequest;
import com.hrms.hr_payroll_management_system.dto.response.announcement.AnnouncementResponse;

import java.util.List;

public interface AnnouncementService {

    AnnouncementResponse create(CreateAnnouncementRequest request, String postedByEmail);

    List<AnnouncementResponse> getRecent(int limit);

    List<AnnouncementResponse> getAll();

    void deactivate(Long id);
}
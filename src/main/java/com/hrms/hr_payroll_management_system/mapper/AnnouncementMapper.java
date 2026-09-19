package com.hrms.hr_payroll_management_system.mapper;

import com.hrms.hr_payroll_management_system.dto.response.announcement.AnnouncementResponse;
import com.hrms.hr_payroll_management_system.entity.Announcement;
import org.springframework.stereotype.Component;

@Component
public class AnnouncementMapper {

    public AnnouncementResponse toResponse(Announcement a) {
        return AnnouncementResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .body(a.getBody())
                .postedDate(a.getPostedDate())
                .postedByName(
                        a.getPostedBy() != null
                                ? a.getPostedBy().getFirstName() + " " + a.getPostedBy().getLastName()
                                : null
                )
                .active(a.getActive())
                .build();
    }
}
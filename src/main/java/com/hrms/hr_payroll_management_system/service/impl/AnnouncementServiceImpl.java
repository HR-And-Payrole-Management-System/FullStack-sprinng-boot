package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.announcement.CreateAnnouncementRequest;
import com.hrms.hr_payroll_management_system.dto.response.announcement.AnnouncementResponse;
import com.hrms.hr_payroll_management_system.entity.Announcement;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.AnnouncementMapper;
import com.hrms.hr_payroll_management_system.repository.AnnouncementRepository;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.repository.UserRepository;
import com.hrms.hr_payroll_management_system.service.AnnouncementService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final BranchRepository branchRepository;
    private final AnnouncementMapper announcementMapper;

    @Override
    @Transactional
    public AnnouncementResponse create(CreateAnnouncementRequest request, String postedByEmail) {

        User postedBy = userRepository.findByEmail(postedByEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Company company = request.getCompanyId() != null
                ? companyRepository.findById(request.getCompanyId())
                        .orElseThrow(() -> new ResourceNotFoundException("Company not found."))
                : null;

        Branch branch = request.getBranchId() != null
                ? branchRepository.findById(request.getBranchId())
                        .orElseThrow(() -> new ResourceNotFoundException("Branch not found."))
                : null;

        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .body(request.getBody())
                .postedDate(LocalDate.now())
                .company(company)
                .branch(branch)
                .postedBy(postedBy)
                .active(true)
                .build();

        return announcementMapper.toResponse(announcementRepository.save(announcement));
    }

    @Override
    public List<AnnouncementResponse> getRecent(int limit) {
        return announcementRepository
                .findByActiveTrueOrderByPostedDateDesc(PageRequest.of(0, limit))
                .stream()
                .map(announcementMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementResponse> getAll() {
        return announcementRepository.findAll()
                .stream()
                .map(announcementMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deactivate(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found."));
        announcement.setActive(false);
        announcementRepository.save(announcement);
    }
}
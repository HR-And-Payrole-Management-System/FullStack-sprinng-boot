package com.hrms.hr_payroll_management_system.service.holiday.impl;

import com.hrms.hr_payroll_management_system.dto.request.holiday.CreateHolidayRequest;
import com.hrms.hr_payroll_management_system.dto.request.holiday.UpdateHolidayRequest;
import com.hrms.hr_payroll_management_system.dto.response.holiday.HolidayResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.entity.Holiday;
import com.hrms.hr_payroll_management_system.enums.HolidayType;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.HolidayMapper;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.repository.HolidayRepository;
import com.hrms.hr_payroll_management_system.service.holiday.HolidayService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HolidayServiceImpl
        implements HolidayService {

    private final HolidayRepository holidayRepository;
    private final CompanyRepository companyRepository;
    private final BranchRepository branchRepository;
    private final HolidayMapper holidayMapper;

    @Override
    public HolidayResponse create(
            CreateHolidayRequest request
    ) {

        validateDateRange(
                request.getHolidayDate(),
                request.getHolidayDate()
        );

        if (holidayRepository
                .existsByNameAndHolidayDate(
                        request.getName(),
                        request.getHolidayDate()
                )) {

            throw new DuplicateResourceException(
                    "Holiday already exists on this date."
            );
        }

        Company company =
                getCompany(request.getCompanyId());

        Branch branch =
                getBranch(request.getBranchId());

        validateScope(
                request.getType(),
                company,
                branch
        );

        Holiday holiday =
                Holiday.builder()
                        .name(request.getName())
                        .holidayDate(
                                request.getHolidayDate()
                        )
                        .type(request.getType())
                        .company(company)
                        .branch(branch)
                        .description(
                                request.getDescription()
                        )
                        .paidHoliday(
                                request.getPaidHoliday()
                        )
                        .active(true)
                        .build();

        return holidayMapper.toResponse(
                holidayRepository.save(holiday)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public HolidayResponse getById(Long id) {

        return holidayMapper.toResponse(
                getHoliday(id)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<HolidayResponse> getAll() {

        return holidayRepository.findAll()
                .stream()
                .map(holidayMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HolidayResponse> getByDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {

        validateDateRange(
                startDate,
                endDate
        );

        return holidayRepository
                .findByHolidayDateBetweenAndActiveTrueOrderByHolidayDateAsc(
                        startDate,
                        endDate
                )
                .stream()
                .map(holidayMapper::toResponse)
                .toList();
    }

    @Override
    public HolidayResponse update(
            Long id,
            UpdateHolidayRequest request
    ) {

        Holiday holiday =
                getHoliday(id);

        Company company =
                getCompany(request.getCompanyId());

        Branch branch =
                getBranch(request.getBranchId());

        validateScope(
                request.getType(),
                company,
                branch
        );

        boolean changedIdentity =
                !holiday.getName()
                        .equalsIgnoreCase(
                                request.getName()
                        )
                || !holiday.getHolidayDate()
                        .equals(
                                request.getHolidayDate()
                        );

        if (changedIdentity
                && holidayRepository
                .existsByNameAndHolidayDate(
                        request.getName(),
                        request.getHolidayDate()
                )) {

            throw new DuplicateResourceException(
                    "Holiday already exists on this date."
            );
        }

        holiday.setName(
                request.getName()
        );

        holiday.setHolidayDate(
                request.getHolidayDate()
        );

        holiday.setType(
                request.getType()
        );

        holiday.setCompany(company);
        holiday.setBranch(branch);

        holiday.setDescription(
                request.getDescription()
        );

        holiday.setPaidHoliday(
                request.getPaidHoliday()
        );

        holiday.setActive(
                request.getActive()
        );

        return holidayMapper.toResponse(
                holidayRepository.save(holiday)
        );
    }

    @Override
    public void delete(Long id) {

        Holiday holiday =
                getHoliday(id);

        holidayRepository.delete(holiday);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isHoliday(LocalDate date) {

        return holidayRepository
                .existsByHolidayDateAndActiveTrue(
                        date
                );
    }

    private Holiday getHoliday(Long id) {

        return holidayRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Holiday not found."
                        )
                );
    }

    private Company getCompany(Long id) {

        if (id == null) {
            return null;
        }

        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found."
                        )
                );
    }

    private Branch getBranch(Long id) {

        if (id == null) {
            return null;
        }

        return branchRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Branch not found."
                        )
                );
    }

    private void validateScope(
            HolidayType type,
            Company company,
            Branch branch
    ) {

        if (type == HolidayType.PUBLIC_HOLIDAY) {

            if (company != null || branch != null) {
                throw new BadRequestException(
                        "Public holiday cannot have company or branch."
                );
            }
        }

        if (type == HolidayType.COMPANY_HOLIDAY
                && company == null) {

            throw new BadRequestException(
                    "Company holiday requires companyId."
            );
        }

        if (type == HolidayType.BRANCH_HOLIDAY
                && branch == null) {

            throw new BadRequestException(
                    "Branch holiday requires branchId."
            );
        }
    }

    private void validateDateRange(
            LocalDate start,
            LocalDate end
    ) {

        if (start == null || end == null) {
            throw new BadRequestException(
                    "Date is required."
            );
        }

        if (end.isBefore(start)) {
            throw new BadRequestException(
                    "End date cannot be before start date."
            );
        }
    }
}
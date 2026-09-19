package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.location.CreateLocationRequest;
import com.hrms.hr_payroll_management_system.dto.request.location.UpdateLocationRequest;
import com.hrms.hr_payroll_management_system.dto.response.location.LocationResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Location;
import com.hrms.hr_payroll_management_system.enums.Status;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.LocationMapper;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.LocationRepository;
import com.hrms.hr_payroll_management_system.service.LocationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;
    private final BranchRepository branchRepository;

    @Override
    public LocationResponse create(CreateLocationRequest request) {

        Branch branch = resolveBranch(request.getBranchId());

        Location location = locationMapper.toEntity(request);
        location.setBranch(branch);
        location.setStatus(Status.ACTIVE);

        boolean isFirstForBranch =
                !locationRepository.existsByBranchId(branch.getId());

        boolean makePrimary =
                Boolean.TRUE.equals(request.getPrimary()) || isFirstForBranch;

        if (makePrimary) {
            clearExistingPrimary(branch.getId(), null);
        }

        location.setPrimary(makePrimary);

        return locationMapper.toResponse(
                locationRepository.save(location)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> getAll() {

        return locationRepository.findAll()
                .stream()
                .map(locationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LocationResponse getById(Long id) {

        return locationMapper.toResponse(getLocation(id));
    }

    @Override
    public LocationResponse update(
            Long id,
            UpdateLocationRequest request
    ) {

        Location location = getLocation(id);
        Branch branch = resolveBranch(request.getBranchId());

        locationMapper.updateEntity(request, location);
        location.setBranch(branch);

        if (Boolean.TRUE.equals(request.getPrimary())) {
            clearExistingPrimary(branch.getId(), location.getId());
            location.setPrimary(true);
        } else if (Boolean.FALSE.equals(request.getPrimary())
                && Boolean.TRUE.equals(location.getPrimary())
                && !locationRepository
                        .existsByBranchIdAndPrimaryTrueAndIdNot(
                                branch.getId(),
                                location.getId()
                        )) {

            throw new BadRequestException(
                    "Branch must have at least one primary location."
            );
        }

        if (request.getStatus() != null
                && !request.getStatus().isBlank()) {
            location.setStatus(parseStatus(request.getStatus()));
        }

        return locationMapper.toResponse(
                locationRepository.save(location)
        );
    }

    @Override
    public void delete(Long id) {

        Location location = getLocation(id);

        locationRepository.delete(location);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> getByBranchId(Long branchId) {

        if (!branchRepository.existsById(branchId)) {
            throw new ResourceNotFoundException("Branch not found.");
        }

        return locationRepository.findByBranchId(branchId)
                .stream()
                .map(locationMapper::toResponse)
                .toList();
    }

    private Location getLocation(Long id) {

        return locationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Location not found.")
                );
    }

    private Branch resolveBranch(Long branchId) {

        return branchRepository.findById(branchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Branch not found.")
                );
    }

    private void clearExistingPrimary(Long branchId, Long excludeId) {

        List<Location> primaries = locationRepository.findByBranchId(branchId)
                .stream()
                .filter(Location::getPrimary)
                .filter(l -> excludeId == null || !l.getId().equals(excludeId))
                .toList();

        primaries.forEach(l -> l.setPrimary(false));

        locationRepository.saveAll(primaries);
    }

    private Status parseStatus(String status) {

        try {
            return Status.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
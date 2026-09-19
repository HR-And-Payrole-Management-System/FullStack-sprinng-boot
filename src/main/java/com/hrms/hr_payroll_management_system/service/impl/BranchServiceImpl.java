package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.branch.CreateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.request.branch.UpdateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.response.branch.BranchResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.BranchMapper;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.service.BranchService;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import com.hrms.hr_payroll_management_system.exception.BadRequestException; // already imported
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BranchServiceImpl
        implements BranchService {

    private final BranchRepository branchRepository;
    private final CompanyRepository companyRepository;
    private final BranchMapper branchMapper;
    private final OrganizationIntegrityService organizationIntegrityService;
    @Override
    public BranchResponse create(
            CreateBranchRequest request
    ) {

        if (branchRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException(
                    "Branch code already exists."
            );
        }

        Company company =
                companyRepository.findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found."
                                )
                        );
        if (Boolean.TRUE.equals(request.getHeadOffice())
                && branchRepository
                .existsByCompanyIdAndHeadOfficeTrue(
                        company.getId()
                )) {

        throw new BadRequestException(
                "Company already has a head office."
        );
        }

        Branch branch =
                branchMapper.toEntity(request);

        branch.setCompany(company);

        Branch savedBranch =
                branchRepository.save(branch);

        return branchMapper.toResponse(savedBranch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getAll() {

        return branchRepository.findAll()
                .stream()
                .map(branchMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse getById(Long id) {

        Branch branch = getBranch(id);

        return branchMapper.toResponse(branch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getByCompanyId(
            Long companyId
    ) {

        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException(
                    "Company not found."
            );
        }

        return branchRepository
                .findByCompanyId(companyId)
                .stream()
                .map(branchMapper::toResponse)
                .toList();
    }

    @Override
    public BranchResponse update(
            Long id,
            UpdateBranchRequest request
    ) {

        Branch branch = getBranch(id);

        if (!branch.getCode()
                .equalsIgnoreCase(request.getCode())
                && branchRepository.existsByCode(
                        request.getCode()
                )) {

            throw new DuplicateResourceException(
                    "Branch code already exists."
            );
        }

        Company company =
                companyRepository.findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found."
                                )
                        );
        if (Boolean.TRUE.equals(request.getHeadOffice())
                && branchRepository
                .existsByCompanyIdAndHeadOfficeTrueAndIdNot(
                        company.getId(),
                        branch.getId()
                )) {

        throw new BadRequestException(
                "Company already has another head office."
        );
        }

        branchMapper.updateEntity(
                request,
                branch
        );

        branch.setCompany(company);

        Branch updatedBranch =
                branchRepository.save(branch);

        return branchMapper.toResponse(updatedBranch);
    }

    @Override
    public void delete(Long id){
        Branch branch = getBranch(id);

        organizationIntegrityService
                .validateBranchDeletion(id);
        branchRepository.delete(branch);
    }

    private Branch getBranch(Long id) {

        return branchRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Branch not found."
                        )
                );
    }
    @Value("${app.upload.dir}")
        private String uploadDir;

        private static final List<String> ALLOWED_LOGO_TYPES =
                List.of("image/jpeg", "image/png", "image/webp");
        private static final long MAX_LOGO_SIZE_BYTES = 3L * 1024 * 1024;

        @Override
        public BranchResponse uploadLogo(Long id, MultipartFile file) {

        Branch branch = getBranch(id);

        if (file == null || file.isEmpty()) {
                throw new BadRequestException("No file was uploaded.");
        }
        if (file.getSize() > MAX_LOGO_SIZE_BYTES) {
                throw new BadRequestException("Logo must be 3MB or smaller.");
        }
        if (!ALLOWED_LOGO_TYPES.contains(file.getContentType())) {
                throw new BadRequestException("Only JPG, PNG, or WEBP images are allowed.");
        }

        try {
                Path dir = Paths.get(uploadDir);
                Files.createDirectories(dir);

                if (branch.getLogoUrl() != null && branch.getLogoUrl().startsWith("/uploads/")) {
                try {
                        Path oldFile = Paths.get(".", branch.getLogoUrl());
                        Files.deleteIfExists(oldFile);
                } catch (Exception ignored) {
                        // old logo was an external URL or otherwise unremovable — safe to skip
                }
                }

                String ext = switch (file.getContentType()) {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                default -> ".jpg";
                };
                String filename = "branch-" + id + "-" + UUID.randomUUID() + ext;
                Path target = dir.resolve(filename);

                Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

                branch.setLogoUrl("/uploads/photos/" + filename);
                branchRepository.save(branch);

        } catch (IOException e) {
                throw new BadRequestException("Failed to save the uploaded logo.");
        }

        return branchMapper.toResponse(branch);
        }
}
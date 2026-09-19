package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.company.CreateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.request.company.UpdateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.response.company.CompanyResponse;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.CompanyMapper;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.service.CompanyService;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl
        implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final OrganizationIntegrityService organizationIntegrityService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_LOGO_TYPES =
            List.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_LOGO_SIZE_BYTES = 3L * 1024 * 1024; // 3MB

    @Override
    public CompanyResponse create(
            CreateCompanyRequest request
    ) {

        if (companyRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Company name already exists."
            );
        }

        if (companyRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Company email already exists."
            );
        }

        Company company =
                companyMapper.toEntity(request);

        Company savedCompany =
                companyRepository.save(company);

        return companyMapper.toResponse(savedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAll() {

        return companyRepository.findAll()
                .stream()
                .map(companyMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getById(Long id) {

        Company company = getCompany(id);

        return companyMapper.toResponse(company);
    }

    @Override
    public CompanyResponse update(
            Long id,
            UpdateCompanyRequest request
    ) {

        Company company = getCompany(id);

        if (!company.getName()
                .equalsIgnoreCase(request.getName())
                && companyRepository.existsByName(
                        request.getName()
                )) {

            throw new DuplicateResourceException(
                    "Company name already exists."
            );
        }

        if (!company.getEmail()
                .equalsIgnoreCase(request.getEmail())
                && companyRepository.existsByEmail(
                        request.getEmail()
                )) {

            throw new DuplicateResourceException(
                    "Company email already exists."
            );
        }

        companyMapper.updateEntity(
                request,
                company
        );

        Company updatedCompany =
                companyRepository.save(company);

        return companyMapper.toResponse(updatedCompany);
    }

    @Override
    public void delete(Long id) {

        Company company = getCompany(id);

        organizationIntegrityService.validateBranchDeletion(id);

        companyRepository.delete(company);
    }

    @Override
    public CompanyResponse uploadLogo(Long id, MultipartFile file) {

        Company company = getCompany(id);

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

            if (company.getLogoUrl() != null && company.getLogoUrl().startsWith("/uploads/")) {
                try {
                    Path oldFile = Paths.get(".", company.getLogoUrl());
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
            String filename = "company-" + id + "-" + UUID.randomUUID() + ext;
            Path target = dir.resolve(filename);

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            company.setLogoUrl("/uploads/photos/" + filename);
            companyRepository.save(company);

        } catch (IOException e) {
            throw new BadRequestException("Failed to save the uploaded logo.");
        }

        return companyMapper.toResponse(company);
    }

    private Company getCompany(Long id) {

        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found."
                        )
                );
    }
}
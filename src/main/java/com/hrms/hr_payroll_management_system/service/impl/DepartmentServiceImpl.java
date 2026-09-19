package com.hrms.hr_payroll_management_system.service.impl;

import com.hrms.hr_payroll_management_system.dto.request.department.AssignDepartmentOrganizationRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.CreateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.request.department.UpdateDepartmentRequest;
import com.hrms.hr_payroll_management_system.dto.response.department.DepartmentResponse;
import com.hrms.hr_payroll_management_system.entity.Branch;
import com.hrms.hr_payroll_management_system.entity.Company;
import com.hrms.hr_payroll_management_system.entity.Department;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.DepartmentMapper;
import com.hrms.hr_payroll_management_system.repository.BranchRepository;
import com.hrms.hr_payroll_management_system.repository.CompanyRepository;
import com.hrms.hr_payroll_management_system.repository.DepartmentRepository;
import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.service.DepartmentService;
import com.hrms.hr_payroll_management_system.service.OrganizationIntegrityService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
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
public class DepartmentServiceImpl
        implements DepartmentService {

    private final OrganizationIntegrityServiceImpl organizationIntegrityServiceImpl;
    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final BranchRepository branchRepository;
    private final DepartmentMapper departmentMapper;
    private final OrganizationIntegrityService organizationIntegrityService;
    private final EmployeeRepository employeeRepository;

    // Wraps departmentMapper.toResponse(...) and fills in the computed
    // employeeCount field, which is not stored on the entity and so
    // MapStruct can't map it automatically.
    private DepartmentResponse toResponseWithCount(Department department) {
        DepartmentResponse response = departmentMapper.toResponse(department);
        response.setEmployeeCount(
                employeeRepository.countByDepartmentId(department.getId())
        );
        return response;
    }

    @Override
    public DepartmentResponse create(
            CreateDepartmentRequest request
    ) {

        Department department =
                departmentMapper.toEntity(request);

        Department savedDepartment =
                departmentRepository.save(department);

        return toResponseWithCount(savedDepartment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAll() {

        return departmentRepository.findAll()
                .stream()
                .map(this::toResponseWithCount)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getById(
            Long id
    ) {

        return toResponseWithCount(
                getDepartment(id)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getByCompanyId(
            Long companyId
    ) {

        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException(
                    "Company not found."
            );
        }

        return departmentRepository
                .findByCompanyId(companyId)
                .stream()
                .map(this::toResponseWithCount)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getByBranchId(
            Long branchId
    ) {

        if (!branchRepository.existsById(branchId)) {
            throw new ResourceNotFoundException(
                    "Branch not found."
            );
        }

        return departmentRepository
                .findByBranchId(branchId)
                .stream()
                .map(this::toResponseWithCount)
                .toList();
    }

    @Override
    public DepartmentResponse update(
            Long id,
            UpdateDepartmentRequest request
    ) {

        Department department =
                getDepartment(id);

        if (department.getBranch() != null
                && !department.getName()
                .equalsIgnoreCase(request.getName())
                && departmentRepository.existsByNameAndBranchId(
                        request.getName(),
                        department.getBranch().getId()
                )) {

            throw new DuplicateResourceException(
                    "Department name already exists in this branch."
            );
        }

        departmentMapper.updateEntity(
                request,
                department
        );

        return toResponseWithCount(
                departmentRepository.save(department)
        );
    }

    @Override
    public DepartmentResponse assignOrganization(
            Long departmentId,
            AssignDepartmentOrganizationRequest request
    ) {

        Department department =
                getDepartment(departmentId);

        Company company =
                companyRepository.findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Company not found."
                                )
                        );

        Branch branch =
                branchRepository.findById(
                                request.getBranchId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Branch not found."
                                )
                        );

        if (!branch.getCompany()
                .getId()
                .equals(company.getId())) {

            throw new BadRequestException(
                    "Branch does not belong to the selected company."
            );
        }

        if (departmentRepository.existsByNameAndBranchId(
                department.getName(),
                branch.getId()
        )) {

            Department current =
                    departmentRepository.findById(
                                    departmentId
                            )
                            .orElseThrow();

            if (current.getBranch() == null
                    || !current.getBranch()
                    .getId()
                    .equals(branch.getId())) {

                throw new DuplicateResourceException(
                        "Department name already exists in this branch."
                );
            }
        }

        department.setCompany(company);
        department.setBranch(branch);

        Department savedDepartment =
                departmentRepository.save(department);

        return toResponseWithCount(savedDepartment);
    }

    @Override
        public void delete(Long id) {

        Department department =
                getDepartment(id);

        organizationIntegrityService
                .validateDepartmentDeletion(id);

        departmentRepository.delete(department);
        }

    private Department getDepartment(
            Long id
    ) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found."
                        )
                );
    }

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_LOGO_TYPES =
            List.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_LOGO_SIZE_BYTES = 3L * 1024 * 1024; // 3MB

    @Override
    public DepartmentResponse uploadLogo(Long id, MultipartFile file) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found."));

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

            if (department.getLogoUrl() != null && department.getLogoUrl().startsWith("/uploads/")) {
                try {
                    Path oldFile = Paths.get(".", department.getLogoUrl());
                    Files.deleteIfExists(oldFile);
                } catch (Exception ignored) {
                    // old logo unremovable — safe to skip
                }
            }

            String ext = switch (file.getContentType()) {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                default -> ".jpg";
            };
            String filename = "department-" + id + "-" + UUID.randomUUID() + ext;
            Path target = dir.resolve(filename);

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            department.setLogoUrl("/uploads/photos/" + filename);
            departmentRepository.save(department);

        } catch (IOException e) {
            throw new BadRequestException("Failed to save the uploaded logo.");
        }

        return toResponseWithCount(department);
    }

}
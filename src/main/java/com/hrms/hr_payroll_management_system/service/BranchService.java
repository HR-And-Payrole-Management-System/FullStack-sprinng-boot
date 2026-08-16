package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.branch.CreateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.request.branch.UpdateBranchRequest;
import com.hrms.hr_payroll_management_system.dto.response.branch.BranchResponse;

import java.util.List;

public interface BranchService {

    BranchResponse create(
            CreateBranchRequest request
    );

    List<BranchResponse> getAll();

    BranchResponse getById(Long id);

    List<BranchResponse> getByCompanyId(
            Long companyId
    );

    BranchResponse update(
            Long id,
            UpdateBranchRequest request
    );

    void delete(Long id);
}
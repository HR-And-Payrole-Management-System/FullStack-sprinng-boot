package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.dto.request.company.CreateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.request.company.UpdateCompanyRequest;
import com.hrms.hr_payroll_management_system.dto.response.company.CompanyResponse;

import java.util.List;

public interface CompanyService {

    CompanyResponse create(
            CreateCompanyRequest request
    );

    List<CompanyResponse> getAll();

    CompanyResponse getById(Long id);

    CompanyResponse update(
            Long id,
            UpdateCompanyRequest request
    );

    void delete(Long id);
}
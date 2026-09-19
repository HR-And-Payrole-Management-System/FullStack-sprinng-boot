package com.hrms.hr_payroll_management_system.service;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.idcard.CreateIdCardRequest;
import com.hrms.hr_payroll_management_system.dto.request.idcard.UpdateIdCardRequest;
import com.hrms.hr_payroll_management_system.dto.response.idcard.IdCardResponse;
import com.hrms.hr_payroll_management_system.enums.IdCardStatus;

public interface IdCardService {

    IdCardResponse create(Long employeeId, CreateIdCardRequest request);

    IdCardResponse getById(Long id);

    IdCardResponse getByEmployee(Long employeeId);

    PageResponse<IdCardResponse> getAll(int page, int size, IdCardStatus status);

    IdCardResponse update(Long id, UpdateIdCardRequest request);

    void delete(Long id);
}
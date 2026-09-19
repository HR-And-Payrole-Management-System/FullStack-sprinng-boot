package com.hrms.hr_payroll_management_system.service.recognition.impl;

import com.hrms.hr_payroll_management_system.dto.request.recognition.CreateCoreValueRequest;
import com.hrms.hr_payroll_management_system.dto.response.recognition.CoreValueResponse;
import com.hrms.hr_payroll_management_system.entity.recognition.CoreValue;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.repository.recognition.CoreValueRepository;
import com.hrms.hr_payroll_management_system.repository.recognition.RecognitionRepository;
import com.hrms.hr_payroll_management_system.service.recognition.CoreValueService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoreValueServiceImpl implements CoreValueService {

    private final CoreValueRepository coreValueRepository;
    private final RecognitionRepository recognitionRepository;

    @Override
    @Transactional
    public CoreValueResponse create(CreateCoreValueRequest request) {
        CoreValue value = CoreValue.builder()
                .name(request.getName())
                .description(request.getDescription())
                .icon(request.getIcon())
                .build();
        return toResponse(coreValueRepository.save(value));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CoreValueResponse> getAll() {
        return coreValueRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        CoreValue value = coreValueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Core value not found: " + id));

        if (recognitionRepository.existsByCoreValueId(id)) {
            throw new IllegalStateException(
                    "Cannot delete \"" + value.getName() + "\" — it's already used on existing recognitions.");
        }

        coreValueRepository.delete(value);
    }

    private CoreValueResponse toResponse(CoreValue v) {
        return CoreValueResponse.builder()
                .id(v.getId())
                .name(v.getName())
                .description(v.getDescription())
                .icon(v.getIcon())
                .build();
    }
}
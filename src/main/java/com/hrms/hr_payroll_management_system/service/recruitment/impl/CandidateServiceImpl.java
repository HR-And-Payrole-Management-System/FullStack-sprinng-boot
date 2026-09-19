package com.hrms.hr_payroll_management_system.service.recruitment.impl;

import com.hrms.hr_payroll_management_system.dto.request.recruitment.CreateCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.request.recruitment.UpdateCandidateRequest;
import com.hrms.hr_payroll_management_system.dto.response.recruitment.CandidateResponse;
import com.hrms.hr_payroll_management_system.entity.recruitment.Candidate;
import com.hrms.hr_payroll_management_system.enums.CandidateSource;
import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.DuplicateResourceException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.mapper.recruitment.CandidateMapper;
import com.hrms.hr_payroll_management_system.repository.recruitment.ApplicationRepository;
import com.hrms.hr_payroll_management_system.repository.recruitment.CandidateRepository;
import com.hrms.hr_payroll_management_system.service.recruitment.CandidateService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;
    private final CandidateMapper candidateMapper;
    private final ApplicationRepository applicationRepository;

    @Override
    public CandidateResponse create(CreateCandidateRequest request) {

        if (candidateRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "A candidate with this email already exists."
            );
        }

        Candidate candidate = candidateMapper.toEntity(request);
        candidate.setSource(parseSource(request.getSource()));

        return toEnrichedResponse(candidateRepository.save(candidate));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateResponse> getAll() {

        return candidateRepository.findAll()
                .stream()
                .map(this::toEnrichedResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getById(Long id) {

        return toEnrichedResponse(getCandidate(id));
    }

    @Override
    public CandidateResponse update(
            Long id,
            UpdateCandidateRequest request
    ) {

        Candidate candidate = getCandidate(id);

        if (!candidate.getEmail().equalsIgnoreCase(request.getEmail())
                && candidateRepository.existsByEmail(request.getEmail())) {

            throw new DuplicateResourceException(
                    "A candidate with this email already exists."
            );
        }

        candidateMapper.updateEntity(request, candidate);
        candidate.setSource(parseSource(request.getSource()));

        return toEnrichedResponse(candidateRepository.save(candidate));
    }

    @Override
    public void delete(Long id) {

        Candidate candidate = getCandidate(id);

        if (applicationRepository.existsByCandidateId(id)) {
            throw new BadRequestException(
                    "Cannot delete a candidate who already has applications."
            );
        }

        candidateRepository.delete(candidate);
    }

    private CandidateResponse toEnrichedResponse(Candidate candidate) {

        CandidateResponse response = candidateMapper.toResponse(candidate);

        response.setApplicationCount(
                applicationRepository.findByCandidateId(candidate.getId()).size()
        );

        return response;
    }

    private Candidate getCandidate(Long id) {

        return candidateRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Candidate not found.")
                );
    }

    private CandidateSource parseSource(String source) {

        if (source == null || source.isBlank()) {
            return null;
        }

        try {
            return CandidateSource.valueOf(source.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid candidate source: " + source);
        }
    }
}
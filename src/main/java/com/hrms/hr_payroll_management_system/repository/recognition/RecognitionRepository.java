package com.hrms.hr_payroll_management_system.repository.recognition;

import com.hrms.hr_payroll_management_system.entity.recognition.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RecognitionRepository extends JpaRepository<Recognition, Long> {

    List<Recognition> findAllByOrderByIdDesc();

    List<Recognition> findByGiverIdAndCreatedAtBetween(Long giverId, LocalDateTime start, LocalDateTime end);

    List<Recognition> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    boolean existsByCoreValueId(Long coreValueId);
}
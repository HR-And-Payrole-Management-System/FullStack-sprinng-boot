package com.hrms.hr_payroll_management_system.repository.recognition;

import com.hrms.hr_payroll_management_system.entity.recognition.RecognitionLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecognitionLikeRepository extends JpaRepository<RecognitionLike, Long> {
    Optional<RecognitionLike> findByRecognitionIdAndEmployeeId(Long recognitionId, Long employeeId);
}
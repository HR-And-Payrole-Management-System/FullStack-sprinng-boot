package com.hrms.hr_payroll_management_system.controller.training;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.training.CreateTrainingEnrollmentRequest;
import com.hrms.hr_payroll_management_system.dto.request.training.UpdateTrainingEnrollmentRequest;
import com.hrms.hr_payroll_management_system.dto.response.training.TrainingEnrollmentResponse;
import com.hrms.hr_payroll_management_system.service.training.TrainingEnrollmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/training/enrollments")
@RequiredArgsConstructor
public class TrainingEnrollmentController {

    private final TrainingEnrollmentService trainingEnrollmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_CREATE')")
    public ResponseEntity<ApiResponse<TrainingEnrollmentResponse>> create(
            @Valid @RequestBody CreateTrainingEnrollmentRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<TrainingEnrollmentResponse>builder()
                                .success(true)
                                .message("Enrollment created successfully.")
                                .data(trainingEnrollmentService.create(request))
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_VIEW')")
    public ResponseEntity<ApiResponse<List<TrainingEnrollmentResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<TrainingEnrollmentResponse>>builder()
                        .success(true)
                        .message("Enrollments retrieved successfully.")
                        .data(trainingEnrollmentService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_VIEW')")
    public ResponseEntity<ApiResponse<TrainingEnrollmentResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<TrainingEnrollmentResponse>builder()
                        .success(true)
                        .message("Enrollment retrieved successfully.")
                        .data(trainingEnrollmentService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_UPDATE')")
    public ResponseEntity<ApiResponse<TrainingEnrollmentResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTrainingEnrollmentRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<TrainingEnrollmentResponse>builder()
                        .success(true)
                        .message("Enrollment updated successfully.")
                        .data(trainingEnrollmentService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        trainingEnrollmentService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_VIEW')")
    public ResponseEntity<ApiResponse<List<TrainingEnrollmentResponse>>> getByEmployee(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<TrainingEnrollmentResponse>>builder()
                        .success(true)
                        .message("Enrollments retrieved successfully.")
                        .data(trainingEnrollmentService.getByEmployeeId(employeeId))
                        .build()
        );
    }

    @GetMapping("/program/{programId}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_VIEW')")
    public ResponseEntity<ApiResponse<List<TrainingEnrollmentResponse>>> getByProgram(
            @PathVariable Long programId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<TrainingEnrollmentResponse>>builder()
                        .success(true)
                        .message("Enrollments retrieved successfully.")
                        .data(trainingEnrollmentService.getByProgramId(programId))
                        .build()
        );
    }
}
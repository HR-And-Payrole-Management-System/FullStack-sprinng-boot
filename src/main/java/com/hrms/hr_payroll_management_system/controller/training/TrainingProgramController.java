package com.hrms.hr_payroll_management_system.controller.training;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.training.CreateTrainingProgramRequest;
import com.hrms.hr_payroll_management_system.dto.request.training.UpdateTrainingProgramRequest;
import com.hrms.hr_payroll_management_system.dto.response.training.TrainingProgramResponse;
import com.hrms.hr_payroll_management_system.service.training.TrainingProgramService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/training/programs")
@RequiredArgsConstructor
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_CREATE')")
    public ResponseEntity<ApiResponse<TrainingProgramResponse>> create(
            @Valid @RequestBody CreateTrainingProgramRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<TrainingProgramResponse>builder()
                                .success(true)
                                .message("Training program created successfully.")
                                .data(trainingProgramService.create(request))
                                .build()
                );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_VIEW')")
    public ResponseEntity<ApiResponse<List<TrainingProgramResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<TrainingProgramResponse>>builder()
                        .success(true)
                        .message("Training programs retrieved successfully.")
                        .data(trainingProgramService.getAll())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_VIEW')")
    public ResponseEntity<ApiResponse<TrainingProgramResponse>> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<TrainingProgramResponse>builder()
                        .success(true)
                        .message("Training program retrieved successfully.")
                        .data(trainingProgramService.getById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_UPDATE')")
    public ResponseEntity<ApiResponse<TrainingProgramResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTrainingProgramRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<TrainingProgramResponse>builder()
                        .success(true)
                        .message("Training program updated successfully.")
                        .data(trainingProgramService.update(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('TRAINING_DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        trainingProgramService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
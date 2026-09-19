package com.hrms.hr_payroll_management_system.controller.recognition;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.recognition.GiveRecognitionRequest;
import com.hrms.hr_payroll_management_system.dto.response.recognition.*;
import com.hrms.hr_payroll_management_system.service.recognition.RecognitionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recognition")
@RequiredArgsConstructor
public class RecognitionController {

    private final RecognitionService recognitionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<RecognitionResponse>> give(@Valid @RequestBody GiveRecognitionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<RecognitionResponse>builder()
                .success(true).message("Recognition sent!").data(recognitionService.give(request)).build());
    }

    @GetMapping("/feed")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<RecognitionResponse>>> getFeed() {
        return ResponseEntity.ok(ApiResponse.<List<RecognitionResponse>>builder()
                .success(true).message("Feed retrieved.").data(recognitionService.getFeed()).build());
    }

    @GetMapping("/budget")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<GiverBudgetResponse>> getBudget(@RequestParam Long employeeId) {
        return ResponseEntity.ok(ApiResponse.<GiverBudgetResponse>builder()
                .success(true).message("Budget retrieved.").data(recognitionService.getBudget(employeeId)).build());
    }

    @GetMapping("/leaderboard")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryResponse>>> getLeaderboard() {
        return ResponseEntity.ok(ApiResponse.<List<LeaderboardEntryResponse>>builder()
                .success(true).message("Leaderboard retrieved.").data(recognitionService.getMonthlyLeaderboard()).build());
    }

    @PutMapping("/{id}/like")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<RecognitionResponse>> toggleLike(@PathVariable Long id, @RequestParam Long employeeId) {
        return ResponseEntity.ok(ApiResponse.<RecognitionResponse>builder()
                .success(true).message("Updated.").data(recognitionService.toggleLike(id, employeeId)).build());
    }
}
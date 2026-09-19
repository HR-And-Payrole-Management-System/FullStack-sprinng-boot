package com.hrms.hr_payroll_management_system.controller.survey;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.dto.request.survey.CreateSurveyRequest;
import com.hrms.hr_payroll_management_system.dto.request.survey.SubmitSurveyResponseRequest;
import com.hrms.hr_payroll_management_system.dto.response.survey.SurveyDetailResponse;
import com.hrms.hr_payroll_management_system.dto.response.survey.SurveyResponseSummary;
import com.hrms.hr_payroll_management_system.service.survey.SurveyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/surveys")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;
    private final com.hrms.hr_payroll_management_system.service.survey.SurveyExportService surveyExportService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<SurveyResponseSummary>> create(@Valid @RequestBody CreateSurveyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<SurveyResponseSummary>builder()
                .success(true).message("Survey created.").data(surveyService.create(request)).build());
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<SurveyResponseSummary>> activate(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<SurveyResponseSummary>builder()
                .success(true).message("Survey activated.").data(surveyService.activate(id)).build());
    }

    @PostMapping("/{id}/responses")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<Void>> submitResponse(
            @PathVariable Long id, @Valid @RequestBody SubmitSurveyResponseRequest request
    ) {
        surveyService.submitResponse(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<Void>builder()
                .success(true).message("Response submitted. Thank you!").build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<SurveyResponseSummary>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<SurveyResponseSummary>>builder()
                .success(true).message("Surveys retrieved.").data(surveyService.getAll()).build());
    }

    @GetMapping("/{id}/results")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<SurveyResponseSummary>> getResults(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<SurveyResponseSummary>builder()
                .success(true).message("Results retrieved.").data(surveyService.getResults(id)).build());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<List<SurveyResponseSummary>>> getPending(@RequestParam Long employeeId) {
        return ResponseEntity.ok(ApiResponse.<List<SurveyResponseSummary>>builder()
                .success(true).message("Pending surveys retrieved.").data(surveyService.getPendingForEmployee(employeeId)).build());
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_VIEW')")
    public ResponseEntity<ApiResponse<SurveyDetailResponse>> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<SurveyDetailResponse>builder()
                .success(true).message("Survey detail retrieved.").data(surveyService.getDetail(id)).build());
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<ApiResponse<SurveyResponseSummary>> update(@PathVariable Long id, @Valid @RequestBody CreateSurveyRequest request) {
        return ResponseEntity.ok(ApiResponse.<SurveyResponseSummary>builder()
                .success(true).message("Survey updated.").data(surveyService.update(id, request)).build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        surveyService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Survey deleted.").build());
    }
    @GetMapping("/{id}/export")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_MANAGE')")
    public ResponseEntity<byte[]> exportCsv(@PathVariable Long id) {
        byte[] csv = surveyExportService.exportResultsCsv(id);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=survey-" + id + "-results.csv")
                .header("Content-Type", "text/csv")
                .body(csv);
    }
}
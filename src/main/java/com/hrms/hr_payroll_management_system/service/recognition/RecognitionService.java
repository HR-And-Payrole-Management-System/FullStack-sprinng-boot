package com.hrms.hr_payroll_management_system.service.recognition;

import com.hrms.hr_payroll_management_system.dto.request.recognition.GiveRecognitionRequest;
import com.hrms.hr_payroll_management_system.dto.response.recognition.*;

import java.util.List;

public interface RecognitionService {
    RecognitionResponse give(GiveRecognitionRequest request);
    List<RecognitionResponse> getFeed();
    GiverBudgetResponse getBudget(Long employeeId);
    List<LeaderboardEntryResponse> getMonthlyLeaderboard();
    RecognitionResponse toggleLike(Long recognitionId, Long employeeId);
}
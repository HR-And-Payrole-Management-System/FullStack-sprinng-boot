package com.hrms.hr_payroll_management_system.dto.response.recognition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecognitionResponse {
    private Long id;
    private String giverName;
    private String receiverName;
    private String coreValueName;
    private String coreValueIcon;
    private String message;
    private int points;
    private int likeCount;
    private LocalDateTime createdAt;
}
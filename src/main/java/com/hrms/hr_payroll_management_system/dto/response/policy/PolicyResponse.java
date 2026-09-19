package com.hrms.hr_payroll_management_system.dto.response.policy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyResponse {
    private Long id;
    private String title;
    private String category;
    private String scopeLabel;
    private boolean requiresAcknowledgment;
    private String status;

    private Integer currentVersionNumber; // null until first published
    private Long currentVersionId;
    private String currentContent;
    private LocalDateTime currentPublishedAt;

    private int acknowledgedCount;
    private int totalInScope;
    private int acknowledgmentPercent;
    private List<PolicyAcknowledgmentStatusResponse> acknowledgments;
}
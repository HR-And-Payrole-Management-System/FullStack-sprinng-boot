package com.hrms.hr_payroll_management_system.dto.response.okr;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObjectiveResponse {
    private Long id;
    private String title;
    private String description;
    private Long ownerId;
    private String ownerName;
    private Long parentObjectiveId;
    private String parentObjectiveTitle;
    private int progressPercent; // computed: own key results, or rollup from aligned children
    private List<KeyResultResponse> keyResults;
    private List<ObjectiveResponse> alignedChildren;
}
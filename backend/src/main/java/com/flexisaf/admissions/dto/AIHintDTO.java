package com.flexisaf.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIHintDTO {
    private Long applicantId;
    private BigDecimal aiScore;
    private String recommendedStatus;
    private String generatedNote;
    private String reasoning;
}

package com.flexisaf.admissions.dto;

import com.flexisaf.admissions.entity.Applicant.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String program;
    private BigDecimal gpa;
    private Integer testScore;
    private ApplicationStatus status;
    private String aiHint;
    private BigDecimal aiScore;
    private Integer version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

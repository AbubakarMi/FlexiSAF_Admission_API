package com.flexisaf.admissions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewerNoteDTO {
    private Long id;
    private Long applicantId;
    private String reviewerName;
    private String reviewerEmail;

    @NotBlank(message = "Note content is required")
    @Size(min = 10, max = 5000, message = "Note must be between 10 and 5000 characters")
    private String content;

    private LocalDateTime createdAt;
}

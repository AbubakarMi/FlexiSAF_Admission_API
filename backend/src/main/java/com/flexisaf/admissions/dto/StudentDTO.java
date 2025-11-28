package com.flexisaf.admissions.dto;

import com.flexisaf.admissions.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    private Long userId;
    private String studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String program;
    private Student.Status status;
    private LocalDateTime enrollmentDate;
    private LocalDateTime graduationDate;
    private Double gpa;
    private Integer creditsEarned;
    private Integer creditsRequired;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

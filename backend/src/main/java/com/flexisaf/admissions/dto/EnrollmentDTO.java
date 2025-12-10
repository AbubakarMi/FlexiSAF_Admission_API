package com.flexisaf.admissions.dto;

import com.flexisaf.admissions.entity.StudentCourseEnrollment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {
    private Long id;
    private Long studentId;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Integer credits;
    private String instructor;
    private String program;
    private StudentCourseEnrollment.EnrollmentStatus status;
    private LocalDateTime enrolledDate;
    private LocalDateTime droppedDate;
}
